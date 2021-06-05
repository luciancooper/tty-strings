// Type definitions for tty-strings
// Project: https://github.com/luciancooper/tty-strings
// Definitions by: Lucian Cooper <https://github.com/luciancooper>

/**
 * Get the visual width of a Unicode code point.
 *
 * @example
 * ```ts
 * import { codePointWidth } from 'tty-strings';
 *
 * // The numerical code point for '古' is 53E4
 * const width = codePointWidth(0x53E4); // 2
 * ```
 *
 * @param code - Unicode code point.
 * @returns `2` for full width, `0` for zero width, and `1` for everything else.
 */
export function codePointWidth(code: number): number;

/**
 * Get the length of a string in grapheme clusters. ANSI escape codes will be ignored.
 *
 * @example
 * ```ts
 * import { stringLength } from 'tty-strings';
 *
 * // '🏳️‍🌈'.length === 6
 * const len = stringLength('🏳️‍🌈'); // 1
 * ```
 *
 * @param string - Input string to measure.
 * @returns The length of the string in graphemes.
 */
export function stringLength(string: string): number;

/**
 * Get the visual width of a string. ANSI escape codes will be ignored.
 *
 * @example
 * ```ts
 * import { stringWidth } from 'tty-strings';
 *
 * const width = stringWidth('🧑🏻‍🤝‍🧑🏼'); // 2
 * ```
 *
 * @param string - Input string to measure.
 * @returns The visual width of the string.
 */
export function stringWidth(string: string): number;

declare namespace wordWrap {
    export interface Options {
        /**
         * By default, words that are longer than the specified column width will not be broken and will therefore
         * extend past the specified column width. Setting this to `true` will enable hard wrapping, in which
         * words longer than the column width will be broken and wrapped across multiple rows.
         * @defaultValue `false`
         */
        hard?: boolean;
        /**
         * Trim leading whitespace from the beginning of each line. Setting this to `false` will preserve any
         * leading whitespace found before each line in the input string.
         * @defaultValue `true`
         */
        trimLeft?: boolean;
    }
}

/**
 * Word wrap text to a specified column width. Input string may contain ANSI escape codes.
 *
 * @example
 * ```ts
 * import { wordWrap } from 'tty-strings';
 * import chalk from 'chalk';
 *
 * const text = 'The ' + chalk.bgGreen.magenta('quick brown 🦊 jumps over') + ' the 😴 🐶.';
 * console.log(wordWrap(text, 20));
 * ```
 *
 * @param string - Input text to word wrap.
 * @param columns - Column width to wrap text to.
 * @param options - Word wrap options object.
 * @returns The word wrapped string.
 */
export function wordWrap(string: string, columns: number, options?: wordWrap.Options): string;

/**
 * Slice a string by character index. Behaves like the native `String.slice()`, except that indexes refer
 * to grapheme clusters within the string, and it handles ANSI escape sequences. Negative index values specify
 * a position measured from the character length of the string.
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
export function sliceChars(string: string, beginIndex?: number, endIndex?: number): string;

/**
 * Slice a string by column index. Behaves like the native `String.slice()`, except that indexes account
 * for the visual width of each character, and it handles ANSI escape sequences. Negative index values specify
 * a position measured from the visual width of the string.
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
export function sliceColumns(string: string, beginIndex?: number, endIndex?: number): string;

/**
 * Remove ANSI escape codes from a string.
 *
 * @remarks
 * This method is adapted from chalk's {@link https://github.com/chalk/slice-ansi|`slice-ansi`} package,
 * and is essentially identical.
 *
 * @example
 * ```ts
 * import { stripAnsi } from 'tty-strings';
 *
 * const stripped = stripAnsi('\u001b[32mfoo\u001b[39m'); // 'foo'
 * ```
 *
 * @param string - Input string to strip.
 * @returns The input string with all ANSI escape codes removed.
 */
export function stripAnsi(string: string): string;

/**
 * A generator function that splits a string into its component graphemes. Does not handle ANSI escape codes,
 * so make sure to remove them from input strings before calling this function.
 *
 * @example
 * ```js
 * import { splitChars } from 'tty-strings';
 *
 * // [...'à̰ḇ́ĉ̥'] -> ['a', '\u0300', '\u0330', 'b', '\u0341', '\u0331', 'c', '\u0302', '\u0325']
 * const chars = [...splitChars('à̰ḇ́ĉ̥')]; // ['à̰', 'ḇ́', 'ĉ̥']
 * ```
 *
 * @param string - Input string to split.
 * @returns A generator that yields each grapheme in the input string.
 */
export function splitChars(string: string): Generator<string, void, unknown>;

/**
 * A generator function that splits a string into measured graphemes. Does not handle ANSI escape codes,
 * so make sure to remove them from input strings before calling this function.
 *
 * @example
 * ```js
 * import { charWidths } from 'tty-strings';
 *
 * // Basic latin characters
 * const chars = [...charWidths('abc')]; // [['a', 1], ['b', 1], ['c', 1]]
 *
 * // Full width emoji characters
 * const emojis = [...charWidths('🙈🙉🙊')]; // [['🙈', 2], ['🙉', 2], ['🙊', 2]]
 * ```
 *
 * @param string - Input string to split.
 * @returns A generator that yields a tuple for each grapheme in the input string.
 */
export function charWidths(string: string): Generator<readonly [string, number], void, unknown>;