const stripAnsi = require('./stripAnsi'),
    codePointWidth = require('./codePoint'),
    { graphemeBreakProperty, shouldBreak, classes: { RI, ExtendedPictographic, Extend } } = require('./graphemeBreak'),
    { isEmojiZwjSequence, isEmojiModifierSequence } = require('./emoji');

/**
 * Get the visual width of a string
 * @param {string} string - input string to measure
 * @returns {number} - visual width of the string
 */
module.exports = function stringWidth(string) {
    if (typeof string !== 'string') return 0;
    // strip all ansi control chars & normlize unicode
    const str = stripAnsi(string).normalize('NFC');
    // check if input is an empty string after stripping ansi
    if (str.length === 0) return 0;
    // initialize total width count
    let width = 0,
        // get first code point
        cp = str.codePointAt(0),
        // initialize code points array for the first grapheme cluster
        cpoints = [cp],
        // initialize array to store grapheme break properties
        props = [],
        // get width of first code point in the first grapheme cluster
        fcw = codePointWidth(cp),
        // initialize total width of the first grapheme cluster
        cw = fcw,
        // track if grapheme cluster contains a zero-width-joiner
        zwj = cp === 0x200D,
        // get grapheme break property of the first code point
        prev = graphemeBreakProperty(cp);

    for (let i = cp > 0xFFFF ? 2 : 1, n = str.length; i < n; i += 1) {
        const nextCp = str.codePointAt(i),
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
        } else {
            // check for a regional indicator sequence or an emoji modifier sequence
            const emojiSeq = (prev === RI && next === RI)
                || (prev === ExtendedPictographic && next === Extend && isEmojiModifierSequence(cp, nextCp));
            // if not a emoji flag or modifier seq, increment width of the current grapheme cluster
            if (!emojiSeq) cw += codePointWidth(nextCp);
            // add code point to code points array for the current grapheme cluster
            cpoints.push(nextCp);
            // add grapheme break property to props array
            props.push(prev);
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
};