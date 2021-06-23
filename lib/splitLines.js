const parseAnsi = require('./parseAnsi'),
    { parseEscape, closeEscapes } = require('./utils');

/**
 * Split a string with ANSI escape codes into an array of lines. Supports both `CRLF` and `LF` newlines.
 * @param {string} string - string to split
 * @returns {string[]} - array of lines in the input string
 */
module.exports = function splitLines(string) {
    // ansi escapes stack, items in the form [seq, isLink, close, [i, j]]
    const ansiStack = [],
        // result array to hold processed lines
        result = [],
        // split input string into lines
        lines = String(string).split(/\r?\n/g);
    // iterate through each line in the input string
    for (let i = 0, n = lines.length; i < n; i += 1) {
        // the processed line
        let line = '',
            // intraline index
            j = -1;
        // match all ansi escape codes in the input line
        for (const [chunk, isEscape] of parseAnsi(lines[i])) {
            // check if chunk is an escape sequence
            if (isEscape) {
                // process this escape sequence
                const closed = parseEscape(ansiStack, chunk, [i, j]);
                if (closed && j >= 0) {
                    // append escape if it closes an active item in the stack
                    const [xi, xj] = closed;
                    if (xi < i || (xi === i && xj < j)) line += chunk;
                } else if (closed === null) {
                    // escape is not a SGR/hyperlink escape
                    line += chunk;
                }
                continue;
            }
            // append any new escape sequences from the ansi stack
            line += (j < 0 ? ansiStack : ansiStack.filter(([,,, [xi, xj]]) => (xi === i && xj === j)))
                .map(([s]) => s)
                .join('');
            // append this chunk
            line += chunk;
            // increment the intraline index
            j += 1;
        }
        // close open escape sequences if line is not empty
        if (j >= 0) {
            line += closeEscapes(ansiStack.filter(([,,, [xi, xj]]) => (xi < i || (xi === i && xj < j))));
        }
        // add proccessed line to the result array
        result.push(line);
    }
    return result;
};