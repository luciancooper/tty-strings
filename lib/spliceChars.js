const parseAnsi = require('./parseAnsi'),
    { parseEscape } = require('./utils'),
    splitChars = require('./splitChars'),
    stringLength = require('./stringLength');

/**
 * Insert, remove or replace characters from a string, similar to the native `Array.splice()` method.
 * String may contain ANSI escape codes; inserted content will adopt any ANSI styling applied to the character
 * immediately preceding the insert point.
 * @param {string} string - input string from which to remove, insert, or replace characters
 * @param {number} start - character index at which to begin splicing
 * @param {number} deleteCount - number of characters to remove from the string
 * @param {string} [insert=''] - optional string to be inserted at the index specified by the `start` parameter
 * @returns {string} - the modified input string
 */
module.exports = function spliceChars(string, start, deleteCount, insert = '') {
    // splice start index
    const startIndex = Math.max(start < 0 ? start + stringLength(string) : start, 0),
        // splice end index
        endIndex = startIndex + deleteCount,
        // ansi escapes stack, items in the form [seq, isLink, close, [idx, afterStart]]
        ansiStack = [];
    // the result string
    let result = '',
        // character index
        idx = 0,
        // conventional string index
        i = 0,
        // start found flag
        startFound = false,
        // end found flag
        endFound = false;
    // match all ansi escape codes
    for (const [chunk, isEscape] of parseAnsi(String(string))) {
        // check if chunk is an escape sequence
        if (isEscape) {
            // process this escape sequence
            const closed = parseEscape(ansiStack, chunk, [idx, startFound]);
            // check if insert point has been reached or if chunk is not a SGR/hyperlink escape
            if (closed === null || (!startFound && (idx < startIndex || insert))) {
                result += chunk;
            } else if (closed != null) {
                // append escape if it closes an active escape
                const [x, afterStart] = closed;
                if (!afterStart && (x < startIndex || insert)) result += chunk;
            }
            // increment conventional string index
            i += chunk.length;
            continue;
        }
        // check if the tail of the last chunk hit the end index
        if (endFound) {
            return result
                // append any open escapes found after the insert point
                + ansiStack
                    .filter(([,,, [x, afterStart]]) => afterStart || (x === startIndex && !insert))
                    .map(([s]) => s)
                    .join('')
                // add the rest of the string
                + string.slice(i);
        }
        // iterate through the characters in this chunk
        for (const char of splitChars(chunk)) {
            if (idx < startIndex) {
                result += char;
            } else {
                // check for the start of the splice
                if (idx === startIndex && !startFound) {
                    result += insert;
                    startFound = true;
                }
                // check for end of the splice
                if (idx === endIndex) {
                    return result
                        // append any open escapes found after the insert point
                        + ansiStack
                            .filter(([,,, [x, afterStart]]) => afterStart || (x === startIndex && !insert))
                            .map(([s]) => s)
                            .join('')
                        // add the rest of the string
                        + string.slice(i);
                }
            }
            // increment char index
            idx += 1;
            // increment conventional string index
            i += char.length;
        }
        // check if at the end of this chunk, we have hit the start index
        if (idx === startIndex && !startFound) {
            result += insert;
            startFound = true;
        }
        // the end of this chunk hits the endIndex, set the `endFound` flag
        if (idx === endIndex) endFound = true;
    }
    return startFound ? result : result + insert;
};