import parseAnsi from './parseAnsi';
import { parseEscape, openEscapes, closeEscapes, type AnsiEscape } from './utils';
import splitChars from './splitChars';
import charWidths from './charWidths';
import stringLength from './stringLength';
import stringWidth from './stringWidth';

function createSlicer(
    iterator: (string: string) => Generator<readonly [string, number], void>,
    measureFn: (string: string) => number,
) {
    return (string: string, beginIndex = 0, endIndex = Infinity) => {
        // convert input to string if necessary
        // eslint-disable-next-line no-param-reassign
        if (typeof string !== 'string') string = String(string);
        // if either beginIndex or endIndex are negative, measure the string and adjust
        if (beginIndex < 0 || endIndex < 0) {
            // measure the string
            const n = measureFn(string);
            // adjust begin index if negative
            // eslint-disable-next-line no-param-reassign
            if (beginIndex < 0) beginIndex = n + beginIndex;
            // adjust end index if negative
            // eslint-disable-next-line no-param-reassign
            if (endIndex < 0) endIndex = n + endIndex;
        }
        // if slice span is <= 0, return an empty string
        if (beginIndex >= endIndex) return '';
        // ansi escapes stack, items in the form [seq, isLink, close, idx]
        const ansiStack: AnsiEscape<number>[] = [];
        // the result string
        let result = '',
            // current slice index
            idx = 0,
            // current stack index
            ax = -1,
            // queued ansi stack closings
            closedStack: AnsiEscape<number>[] = [];
        // match all ansi escape codes
        for (const [chunk, isEscape] of parseAnsi(string)) {
            // check if chunk is an escape sequence
            if (isEscape) {
                // process this escape sequence
                const closed = parseEscape(ansiStack, chunk, idx);
                // add any newly closed sequences to the closed stack
                if (closed?.length) closedStack.unshift(...closed);
                continue;
            }
            // check if any unclosed sequences have accumulated
            if (closedStack.length) {
                // close acumulated ansi sequences
                result += closeEscapes(closedStack.filter(([,,, cx]) => cx <= ax));
                // reset the closed stack
                closedStack = [];
            }
            // store the value of the slice index at the outset of this chunk
            const sidx = idx;
            // iterate through the characters in this chunk
            for (const [char, span] of iterator(chunk)) {
                // check if we are currently within the desired slice
                if ((beginIndex < idx || (beginIndex === idx && span > 0)) && idx + span <= endIndex) {
                    // check if the stack index is less than the slice index at the start of this chunk
                    if (ax < sidx) {
                        result += openEscapes(ansiStack.filter(([,,, x]) => x > ax));
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
        return result + closeEscapes([...closedStack, ...ansiStack].filter(([,,, x]) => x <= ax));
    };
}

/**
 * Slice a string by character index. Behaves like the native `String.slice()`, except that indexes refer
 * to grapheme clusters within the string. Negative index values specify a position measured from the
 * character length of the string.
 *
 * @remarks
 * Input string may contain ANSI escape sequences. Style and hyperlink sequences that apply to the
 * sliced portion of the string will be preserved, while all other types of control sequences will be
 * ignored and will not be included in the output slice.
 *
 * @example
 * ```ts
 * import { sliceChars } from 'tty-strings';
 *
 * const slice = sliceChars('🙈🙉🙊', 0, 2); // '🙈🙉'
 * ```
 *
 * @param string - Input string to slice.
 * @param beginIndex - Character index (defaults to `0`) at which to begin the slice.
 * @param endIndex - Character index before which to end the slice.
 * @returns The sliced string.
 */
export const sliceChars = createSlicer(
    function* iterator(str: string) {
        for (const char of splitChars(str)) yield [char, 1];
    },
    stringLength,
);

/**
 * Slice a string by column index. Behaves like the native `String.slice()`, except that indexes account
 * for the visual width of each character. Negative index values specify a position measured from the
 * visual width of the string.
 *
 * @remarks
 * Input string may contain ANSI escape sequences. Style and hyperlink sequences that apply to the
 * sliced portion of the string will be preserved, while all other types of control sequences will be
 * ignored and will not be included in the output slice.
 *
 * @example
 * ```ts
 * import { sliceColumns } from 'tty-strings';
 *
 * // '🙈', '🙉', and '🙊' are all full width characters
 * const slice = sliceColumns('🙈🙉🙊', 0, 2); // '🙈'
 * ```
 *
 * @param string - Input string to slice.
 * @param beginIndex - Column index (defaults to `0`) at which to begin the slice.
 * @param endIndex - Column index before which to end the slice.
 * @returns The sliced string.
 */
export const sliceColumns = createSlicer(charWidths, stringWidth);