import { graphemeBreakProperty, shouldBreak } from './graphemeBreak';

/**
 * A generator function that splits a string into its component graphemes. Does not handle ANSI escape codes,
 * so make sure to remove them from input strings before calling this function.
 *
 * @remarks
 * This function is an implementation of UAX #29 grapheme cluster boundary splitting:
 * {@link https://www.unicode.org/reports/tr29/tr29-21.html#Grapheme_Cluster_Boundaries}
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
export default function* splitChars(string: string): Generator<string, void> {
    if (typeof string !== 'string' || string.length === 0) return;
    // lower string index of the first grapheme cluster
    let i = 0,
        // initialize array to store grapheme break properties
        props: number[] = [],
        // get first code point
        cp = string.codePointAt(0)!,
        // get grapheme break property of the first code point
        prev = graphemeBreakProperty(cp);

    for (let j = cp > 0xFFFF ? 2 : 1, n = string.length; j < n; j += 1) {
        cp = string.codePointAt(j)!;
        // get grapheme break property of the next code point
        const next = graphemeBreakProperty(cp);
        // check if there is a cluster boundary between the two adjacent code points
        if (shouldBreak(props, prev, next)) {
            // a cluster boundry exists, yield the current grapheme cluster
            yield string.slice(i, j);
            // reset grapheme break properties array
            props = [];
            // set lower string index of the next cluster
            i = j;
        } else props.push(prev);
        // ignore surrogates
        if (cp > 0xFFFF) j += 1;
        prev = next;
    }
    // yield the final grapheme cluster
    yield string.slice(i);
}