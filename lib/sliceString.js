/* eslint-disable no-restricted-syntax, no-param-reassign */
const ansiRegex = require('ansi-regex'),
    { styleCodes, closingCodes } = require('./ansiCodes'),
    splitChars = require('./splitChars'),
    charWidths = require('./charWidths');

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

function createSlicer(iterator) {
    return (string, beginIndex = 0, endIndex = Infinity) => {
        if (beginIndex >= endIndex) return '';
        // convert input to string if necessary
        if (typeof string !== 'string') string = String(string);
        // ansi escapes stack, items in the form [idx, seq, isLink, close]
        const ansiStack = [];
        // the result string
        let result = '',
            // current slice index
            idx = 0,
            // current stack index
            ax = -1,
            // lower index of the chunk preceeding each escape sequence
            i = 0;
        // match all ansi escape codes
        for (let regex = ansiRegex(), m = regex.exec(string); m; m = regex.exec(string)) {
            const { 0: seq, index: j } = m;
            // check the length of the chunk preceeding this escape
            if (j > i) {
                // store the value of the slice index at the outset of this chunk
                const sidx = idx;
                // iterate through the characters in this chunk
                for (const [char, span] of iterator(string.slice(i, j))) {
                    // check if we are currently within the desired slice
                    if (beginIndex <= idx && idx + span <= endIndex) {
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
                    // check if we have exceeded the upper limit of the desired slice
                    if (idx >= endIndex) {
                        // close active items in the escape stack and return the result slice
                        return result + closeAnsiStack(ansiStack, ax);
                    }
                }
            }
            // set lower string index of the next chunk to be processed
            i = j + seq.length;
            // eslint-disable-next-line no-control-regex
            const { 1: code, 2: link } = seq.match(/[\u001B\u009B](?:\[(\d+)(?:;\d+)*m|\]8;;(.*)\u0007)/) || {};
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
                    ansiStack.push([idx, seq, false, styleCodes.get(n) || 0]);
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
                    ansiStack.push([idx, seq, true, '\u001B]8;;\u0007']);
                }
            }
            // add escape sequence to result if it closes an active item in the stack
            if (closesActive) result += seq;
        }
        // process the final chunk of the string
        if (i < string.length) {
            // store the value of the slice index at the outset of this chunk
            const cidx = idx;
            // iterate through the characters in the final chunk
            for (const [char, span] of iterator(string.slice(i))) {
                // check if we are currently within the desired slice
                if (beginIndex <= idx && idx + span <= endIndex) {
                    // check if the stack index is less than the slice index at the start of this chunk
                    if (ax < cidx) {
                        result += ansiStack.filter(([x]) => x > ax).map(([, s]) => s).join('');
                        ax = cidx;
                    }
                    // add char to the result
                    result += char;
                }
                // increment current slice index
                idx += span;
                // stop if we have exceeded the upper limit of the desired slice
                if (idx >= endIndex) break;
            }
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
    }),

    /**
     * Extract a section of a string by column index, accounting for the visual width of each character
     * @param {string} string - input string to slice
     * @param {number} [beginIndex=0] - column index at which to begin slice
     * @param {number} [endIndex=Infinity] - column index at which to end slice
     * @returns {string}
     */
    sliceColumns: createSlicer(charWidths),
};