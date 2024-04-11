// eslint-disable-next-line @typescript-eslint/no-require-imports
import ansiRegex = require('ansi-regex');

const regex = ansiRegex();

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
export default function stripAnsi(string: string): string {
    return (typeof string === 'string') ? string.replace(regex, '') : String(string);
}