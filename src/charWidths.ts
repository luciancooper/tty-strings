import codePointWidth from './codePoint';
import { graphemeBreakProperty, isGraphemeBase, shouldBreak, GBProps, Emoji_Modifier } from './graphemeBreak';
import { isEmojiZwjSequence, isEmojiModifierBase } from './emoji';

const {
    RI, ExtendedPictographic, Extend, V, T,
} = GBProps;

/**
 * A generator function that splits a string into measured graphemes. Does not handle ANSI escape codes,
 * so make sure to remove them from input strings before calling this function.
 *
 * @remarks
 * This function is an implementation of UAX #29 grapheme cluster boundary splitting:
 * {@link https://www.unicode.org/reports/tr29/tr29-21.html#Grapheme_Cluster_Boundaries}
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
 * @returns A generator that yields a tuple with each grapheme and its width in the input string.
 */
export default function* charWidths(string: string): Generator<readonly [string, number], void> {
    if (typeof string !== 'string' || string.length === 0) return;
    // lower string index of the first grapheme cluster
    let i = 0,
        // get first code point
        cp = string.codePointAt(0)!,
        // initialize code points array for the first grapheme cluster
        cpoints = [cp],
        // initialize array to store grapheme break properties
        props: number[] = [],
        // get width of first code point in the first grapheme cluster
        fcw = codePointWidth(cp),
        // initialize total width of the first grapheme cluster
        cw = fcw,
        // track if grapheme cluster contains a zero-width-joiner
        zwj = cp === 0x200D,
        // get grapheme break property of the first code point
        prev = graphemeBreakProperty(cp),
        // track if grapheme cluster contains a Grapheme_Base
        base = false,
        // track index last index within the cluster that has been checked for Grapheme_Base
        baseIndex = 0;

    for (let j = cp > 0xFFFF ? 2 : 1, n = string.length; j < n; j += 1) {
        const nextCp = string.codePointAt(j)!,
            // get grapheme break property of the next code point
            next = graphemeBreakProperty(nextCp);
        // check if there is a cluster boundary between the two adjacent code points
        if (shouldBreak(props, prev, next)) {
            // a cluster boundry exists, yield the current grapheme cluster
            yield [
                string.slice(i, j),
                // if cluster is an emoji zwj sequence, its width is that of the first code point in the sequence
                (zwj && props[0] === ExtendedPictographic && isEmojiZwjSequence(cpoints)) ? fcw : cw,
            ];
            // reset grapheme break properties array
            props = [];
            // initialize code points array for the next grapheme cluster
            cpoints = [nextCp];
            // measure width of the first code point in the next grapheme cluster
            fcw = codePointWidth(nextCp);
            // initialize total width of the next grapheme cluster
            cw = fcw;
            // set lower string index of the next cluster
            i = j;
            // reset zero-width-joiner flag
            zwj = nextCp === 0x200D;
            // reset Grapheme_Base flag
            base = false;
            // reset Grapheme_Base index
            baseIndex = 0;
        } else {
            // add code point to code points array for the current grapheme cluster
            cpoints.push(nextCp);
            // add grapheme break property to props array
            props.push(prev);
            // determine if the width of this code point should be factored into the width of the grapheme cluster
            let combining = false;
            if ((next & 0xF) !== Extend) {
                // check for regional indicator sequence or hangul jungseong / jongseong
                combining = (prev === RI && next === RI) || next === V || next === T;
            } else if (next & Emoji_Modifier) {
                // check for an emoji modifier sequence
                combining = (prev === ExtendedPictographic && isEmojiModifierBase(cp));
                // set Grapheme_Base flag, since emoji modifiers have the Grapheme_Base property
                base ||= true;
            } else {
                // go back and check each code point in the cluster to see if there is a Grapheme_Base
                for (; !base && baseIndex < props.length; baseIndex += 1) {
                    base = isGraphemeBase(cpoints[baseIndex]!, props[baseIndex]!);
                }
                // this code point has the property Grapheme_Extend, it is only combining if it follows a Grapheme_Base
                combining = base;
            }
            // if not a combining point, increment width of the current grapheme cluster
            if (!combining) cw += codePointWidth(nextCp);
            // update zero-width-joiner flag
            if (nextCp === 0x200D) zwj = true;
        }
        cp = nextCp;
        // ignore surrogates
        if (cp > 0xFFFF) j += 1;
        prev = next;
    }
    // yield the final grapheme cluster
    yield [
        string.slice(i),
        // if last cluster is an emoji zwj sequence, its width is that of the first code point in the sequence
        (zwj && props[0] === ExtendedPictographic && isEmojiZwjSequence(cpoints)) ? fcw : cw,
    ];
}