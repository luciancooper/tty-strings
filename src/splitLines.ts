import parseAnsi from './parseAnsi';
import { parseEscape, openEscapes, closeEscapes, type AnsiEscape } from './utils';

/**
 * Split a string with ANSI escape codes into an array of lines. Supports both `CRLF` and `LF` newlines.
 *
 * @remarks
 * ANSI escape codes that are style and hyperlink sequences will be wrapped across the output lines,
 * while all other types of control sequences will be ignored but preserved in the output.
 *
 * @example
 * ```ts
 * import { splitLines } from 'tty-strings';
 * import chalk from 'chalk';
 *
 * splitLines(chalk.green('foo\nbar'));
 * // > ['\x1b[32mfoo\x1b[39m', '\x1b[32mbar\x1b[39m']
 * ```
 *
 * @param string - Input string to split.
 * @returns Array of lines in the input string.
 */
export default function splitLines(string: string): string[] {
    // ansi escapes stack, items in the form [seq, isLink, close, [i, j]]
    const ansiStack: AnsiEscape<readonly [number, number]>[] = [],
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
        for (const [chunk, isEscape] of parseAnsi(lines[i]!)) {
            // check if chunk is an escape sequence
            if (isEscape) {
                // process this escape sequence
                const closed = parseEscape(ansiStack, chunk, [i, j]);
                if (closed && j >= 0) {
                    // append escape if it closes an active item in the stack
                    line += closeEscapes(closed.filter(([,,, [xi, xj]]) => xi < i || (xi === i && xj < j)));
                } else if (closed === null) {
                    // escape is not a SGR/hyperlink escape
                    line += chunk;
                }
                continue;
            }
            // append any new escape sequences from the ansi stack
            line += openEscapes(j < 0 ? ansiStack : ansiStack.filter(([,,, [xi, xj]]) => (xi === i && xj === j)));
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
}