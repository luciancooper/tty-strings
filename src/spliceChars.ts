import { parseAnsi, parseEscape, openEscapes, closeEscapes, type AnsiEscape } from './utils';
import splitChars from './splitChars';
import stringLength from './stringLength';

/**
 * Insert, remove or replace characters from a string, similar to the native `Array.splice()` method,
 * except that the start index and delete count refer to grapheme clusters within the string.
 *
 * @remarks
 * String may contain ANSI escape codes; inserted content will adopt any ANSI styling applied to the character
 * immediately preceding the insert point. ANSI control sequences that are not style or hyperlink sequences
 * will be preserved in the output string.
 *
 * @example
 * ```ts
 * import { spliceChars } from 'tty-strings';
 *
 * spliceChars('à̰ b̸ ĉ̥', 2, 1, 'x͎͛ÿz̯̆'); // 'à̰ x͎͛ÿz̯̆ ĉ̥'
 * ```
 *
 * @param string - Input string from which to remove, insert, or replace characters.
 * @param start - Character index at which to begin splicing.
 * @param deleteCount - Number of characters to remove from the string.
 * @param insert - Optional string to be inserted at the index specified by the `start` parameter.
 * @returns The modified input string.
 */
export default function spliceChars(string: string, start: number, deleteCount: number, insert = '') {
    // splice start index
    const startIndex = Math.max(start < 0 ? start + stringLength(string) : start, 0),
        // splice end index
        endIndex = startIndex + deleteCount,
        // ansi escapes stack, items in the form [seq, isLink, close, [idx, afterStart]]
        ansiStack: AnsiEscape<readonly [number, boolean]>[] = [];
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
            } else if (closed.length) {
                // add close sequences for any active escapes in the stack
                result += closeEscapes(closed.filter(([,,, [x, afterStart]]) => (
                    !afterStart && (x < startIndex || insert)
                )));
            }
            // increment conventional string index
            i += chunk.length;
            continue;
        }
        // check if the tail of the last chunk hit the end index
        if (endFound) {
            return result
                // append any open escapes found after the insert point
                + openEscapes(ansiStack.filter(([,,, [x, afterStart]]) => (
                    afterStart || (x === startIndex && !insert)
                )))
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
                        + openEscapes(ansiStack.filter(([,,, [x, afterStart]]) => (
                            afterStart || (x === startIndex && !insert)
                        )))
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
}