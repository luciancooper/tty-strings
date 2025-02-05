import ansiRegex from './ansiRegex';

const regex = ansiRegex();

/**
 * Remove ANSI escape codes from a string.
 *
 * @remarks
 * This method is adapted from chalk's {@link https://github.com/chalk/strip-ansi|`strip-ansi`} package,
 * but uses a more comprehensive regular expression to match escape sequences.
 *
 * @example
 * ```ts
 * import { stripAnsi } from 'tty-strings';
 *
 * const stripped = stripAnsi('\x1b[32mfoo\x1b[39m'); // 'foo'
 * ```
 *
 * @param string - Input string to strip.
 * @returns The input string with all ANSI escape codes removed.
 */
export default function stripAnsi(string: string): string {
    return (typeof string === 'string') ? string.replace(regex, '') : String(string);
}