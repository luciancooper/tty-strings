const ansiRegexPattern = '(?:'
    // csi sequences
    + '(?:\\x1b\\x5b|\\x9b)[\\x30-\\x3f]*[\\x20-\\x2f]*[\\x40-\\x7e]'
    // osc sequences - can be terminated by BEL or ST
    + '|(?:\\x1b\\x5d|\\x9d).*?(?:\\x1b\\x5c|[\\x07\\x9c])'
    // string terminated sequences (dcs, sos, pm, apc)
    + '|(?:\\x1b[\\x50\\x58\\x5e\\x5f]|[\\x90\\x98\\x9e\\x9f]).*?(?:\\x1b\\x5c|\\x9c)'
    // all other escape sequences (nF, Fp, Fe, Fs)
    + '|\\x1b[\\x20-\\x2f]*[\\x30-\\x7e]'
    + ')';

/**
 * Creates a regular expression that matches ANSI escape codes.
 *
 * @remarks
 * This method is modeled off chalk's {@link https://github.com/chalk/ansi-regex|`ansi-regex`} package,
 * but matches a more comprehensive range of ANSI escape sequences.
 *
 * @example
 * ```ts
 * import { ansiRegex } from 'tty-strings';
 *
 * '\x1b[32mfoo\x1b[39m'.match(ansiRegex());
 * // > ['\x1b[32m', '\x1b[39m']
 * ```
 *
 * @param options - Optional options object to specify the global flag.
 * @returns A new regular expression.
 */
export default function ansiRegex({ global = true }: { global?: boolean } = {}) {
    return new RegExp(ansiRegexPattern, global ? 'g' : undefined);
}