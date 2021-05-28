const ansiRegex = require('ansi-regex');

/**
 * A generator function that matches all ansi escape sequences within a string, yielding sequential
 * chunks that are either a matched escape sequence or a run of plain text between matches.
 * @private
 * @param {string} string - input string
 * @yields - `[chunk, isEscape]` pairs
 */
module.exports = function* parseAnsi(string) {
    // lower index of the chunk preceeding each escape sequence
    let i = 0;
    // match all ansi escape codes
    for (let regex = ansiRegex(), m = regex.exec(string); m; m = regex.exec(string)) {
        const { 0: seq, index: j } = m;
        // yield the chunk preceeding this escape if its length > 0
        if (j > i) yield [string.slice(i, j), false];
        // yield the matched escape
        yield [seq, true];
        // set lower string index of the next chunk to be processed
        i = j + seq.length;
    }
    // yield the final chunk of string if its length > 0
    if (i < string.length) yield [string.slice(i), false];
};