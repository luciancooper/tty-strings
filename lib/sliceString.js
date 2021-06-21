/* eslint-disable no-param-reassign */
const parseAnsi = require('./parseAnsi'),
    { styleCodes, closingCodes } = require('./ansiCodes'),
    splitChars = require('./splitChars'),
    charWidths = require('./charWidths'),
    stringLength = require('./stringLength'),
    stringWidth = require('./stringWidth');

function closeAnsiStack(ansiStack, ax) {
    let escapes = '';
    while (ansiStack.length) {
        const [idx,, isLink, close] = ansiStack.pop();
        if (idx > ax) continue;
        escapes += isLink ? close : `\u001B[${close}m`;
        // remove all other escapes in the stack that this escape closes to prevent duplicates
        for (let i = ansiStack.length - 1; i >= 0; i -= 1) {
            const [,, l, c] = ansiStack[i];
            if (isLink ? l : (close === 0 || close === c)) {
                ansiStack.splice(i, 1);
            }
        }
    }
    return escapes;
}

function createSlicer(iterator, measureFn) {
    return (string, beginIndex = 0, endIndex = Infinity) => {
        // convert input to string if necessary
        if (typeof string !== 'string') string = String(string);
        // if either beginIndex or endIndex are negative, measure the string and adjust
        if (beginIndex < 0 || endIndex < 0) {
            // measure the string
            const n = measureFn(string);
            // adjust begin index if negative
            if (beginIndex < 0) beginIndex = n + beginIndex;
            // adjust end index if negative
            if (endIndex < 0) endIndex = n + endIndex;
        }
        // if slice span is <= 0, return an empty string
        if (beginIndex >= endIndex) return '';
        // ansi escapes stack, items in the form [idx, seq, isLink, close]
        const ansiStack = [];
        // the result string
        let result = '',
            // current slice index
            idx = 0,
            // current stack index
            ax = -1;
        // match all ansi escape codes
        for (const [chunk, isEscape] of parseAnsi(string)) {
            // check if chunk is not an escape sequence
            if (!isEscape) {
                // store the value of the slice index at the outset of this chunk
                const sidx = idx;
                // iterate through the characters in this chunk
                for (const [char, span] of iterator(chunk)) {
                    // check if we are currently within the desired slice
                    if ((beginIndex < idx || (beginIndex === idx && span > 0)) && idx + span <= endIndex) {
                        // check if the stack index is less than the slice index at the start of this chunk
                        if (ax < sidx) {
                            result += ansiStack.filter(([x]) => x > ax).map(([, s]) => s).join('');
                            ax = sidx;
                        }
                        // add char to the result
                        result += char;
                    }
                    // increment current slice index
                    idx += span;
                    // stop if the upper limit of the desired slice has been exceeded
                    if (idx >= endIndex) {
                        // close active items in the escape stack and return the result slice
                        return result + closeAnsiStack(ansiStack, ax);
                    }
                }
                continue;
            }
            const { 1: code, 2: link } = chunk.match(/[\u001B\u009B](?:\[(\d+)(?:;\d+)*m|\]8;;(.*)\u0007)/) || {};
            // flag to track if an active item in the stack is closed by this sequence
            let closesActive = false;
            // update ansi escape stack
            if (code) {
                const n = Number(code);
                if (closingCodes.includes(n)) {
                    // remove all escapes that this sequence closes from the stack
                    for (let y = ansiStack.length - 1; y >= 0; y -= 1) {
                        const [x,, isLink, c] = ansiStack[y];
                        // check if item is not a link & is closed by this code
                        if (!isLink && (n === 0 || c === n)) {
                            if (x <= ax) closesActive = true;
                            ansiStack.splice(y, 1);
                        }
                    }
                } else {
                    // add this ansi escape to the stack
                    ansiStack.push([idx, chunk, false, styleCodes.get(n) || 0]);
                }
            } else if (link !== undefined) {
                // if link is an empty string, this is a closing hyperlink sequence
                if (!link.length) {
                    // remove all hyperlink escapes from the stack
                    for (let y = ansiStack.length - 1; y >= 0; y -= 1) {
                        const [x,, isLink] = ansiStack[y];
                        // if item is an open hyperlink, close it
                        if (isLink) {
                            if (x <= ax) closesActive = true;
                            ansiStack.splice(y, 1);
                        }
                    }
                } else {
                    // add this hyperlink escape to the stack
                    ansiStack.push([idx, chunk, true, '\u001B]8;;\u0007']);
                }
            }
            // add escape sequence to result if it closes an active item in the stack
            if (closesActive) result += chunk;
        }
        // close active items in the escape stack and return the result slice
        return result + closeAnsiStack(ansiStack, ax);
    };
}

module.exports = {
    /**
     * Slice a string by character index, indifferent to the visual width of each character
     * @param {string} string - input string to slice
     * @param {number} [beginIndex=0] - character index at which to begin slice
     * @param {number} [endIndex=Infinity] - character index at which to end slice
     * @returns {string}
     */
    sliceChars: createSlicer(function* iterator(str) {
        for (const char of splitChars(str)) yield [char, 1];
    }, stringLength),

    /**
     * Extract a section of a string by column index, accounting for the visual width of each character
     * @param {string} string - input string to slice
     * @param {number} [beginIndex=0] - column index at which to begin slice
     * @param {number} [endIndex=Infinity] - column index at which to end slice
     * @returns {string}
     */
    sliceColumns: createSlicer(charWidths, stringWidth),
};