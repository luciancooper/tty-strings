import stripAnsi from './stripAnsi';
import codePointWidth from './codePoint';
import { graphemeBreakProperty, isGraphemeBase, shouldBreak, GBProps, Emoji_Modifier } from './graphemeBreak';
import { isEmojiZwjSequence, isEmojiModifierBase } from './emoji';

const {
    RI, ExtendedPictographic, Extend, V, T,
} = GBProps;

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
export default function stringWidth(string: string): number {
    if (typeof string !== 'string') return 0;
    // strip all ansi control chars
    const str = stripAnsi(string);
    // check if input is an empty string after stripping ansi
    if (str.length === 0) return 0;
    // initialize total width count
    let width = 0,
        // get first code point
        cp = str.codePointAt(0)!,
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

    for (let i = cp > 0xFFFF ? 2 : 1, n = str.length; i < n; i += 1) {
        const nextCp = str.codePointAt(i)!,
            // get grapheme break property of the next code point
            next = graphemeBreakProperty(nextCp);
        // check if there is a cluster boundary between the two adjacent code points
        if (shouldBreak(props, prev, next)) {
            // if cluster is an emoji zwj sequence, add only width of the first code point in the cluster
            width += (zwj && props[0] === ExtendedPictographic && isEmojiZwjSequence(cpoints)) ? fcw : cw;
            // reset grapheme break properties array
            props = [];
            // initialize code points array for the next grapheme cluster
            cpoints = [nextCp];
            // measure width of the first code point in the next grapheme cluster
            fcw = codePointWidth(nextCp);
            // initialize total width of the next grapheme cluster
            cw = fcw;
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
        if (cp > 0xFFFF) i += 1;
        prev = next;
    }
    // if last cluster is an emoji zwj sequence, add only width of the first code point in the cluster
    width += (zwj && props[0] === ExtendedPictographic && isEmojiZwjSequence(cpoints)) ? fcw : cw;
    return width;
}