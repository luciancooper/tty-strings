/* eslint-disable no-param-reassign */
const parseAnsi = require('./parseAnsi'),
    { parseEscape, closeEscapes } = require('./utils'),
    splitChars = require('./splitChars'),
    charWidths = require('./charWidths'),
    stringLength = require('./stringLength'),
    stringWidth = require('./stringWidth');

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
        // ansi escapes stack, items in the form [seq, isLink, close, idx]
        const ansiStack = [];
        // the result string
        let result = '',
            // current slice index
            idx = 0,
            // current stack index
            ax = -1;
        // match all ansi escape codes
        for (const [chunk, isEscape] of parseAnsi(string)) {
            // check if chunk is an escape sequence
            if (isEscape) {
                // process this escape sequence
                const closed = parseEscape(ansiStack, chunk, idx);
                // add sequence to result if it closes an active item in the stack
                if (closed != null && closed <= ax) result += chunk;
                continue;
            }
            // store the value of the slice index at the outset of this chunk
            const sidx = idx;
            // iterate through the characters in this chunk
            for (const [char, span] of iterator(chunk)) {
                // check if we are currently within the desired slice
                if ((beginIndex < idx || (beginIndex === idx && span > 0)) && idx + span <= endIndex) {
                    // check if the stack index is less than the slice index at the start of this chunk
                    if (ax < sidx) {
                        result += ansiStack.filter(([,,, x]) => x > ax).map(([s]) => s).join('');
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
                    return result + closeEscapes(ansiStack.filter(([,,, x]) => x <= ax));
                }
            }
        }
        // close active items in the escape stack and return the result slice
        return result + closeEscapes(ansiStack.filter(([,,, x]) => x <= ax));
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