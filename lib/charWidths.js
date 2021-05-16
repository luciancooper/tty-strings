const codePointWidth = require('./codePoint'),
    { graphemeBreakProperty, shouldBreak, classes: { RI, ExtendedPictographic, Extend } } = require('./graphemeBreak'),
    { isEmojiZwjSequence, isEmojiModifierSequence } = require('./emoji');

/**
 * A generator that splits a string into `[char, width]` pairs for each user percieved character
 * This function is an implementation of UAX #29 grapheme cluster boundary splitting:
 * {@link https://www.unicode.org/reports/tr29/tr29-21.html#Grapheme_Cluster_Boundaries}
 * @param {string} string - input string
 * @yields {Array} - a `[char, width]` pair for each grapheme in the string
 */
module.exports = function* charWidths(string) {
    if (typeof string !== 'string' || string.length === 0) return;
    // normlize unicode
    const str = string.normalize('NFC');
    // lower string index of the first grapheme cluster
    let i = 0,
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

    for (let j = cp > 0xFFFF ? 2 : 1, n = str.length; j < n; j += 1) {
        const nextCp = str.codePointAt(j),
            // get grapheme break property of the next code point
            next = graphemeBreakProperty(nextCp);
        // check if there is a cluster boundary between the two adjacent code points
        if (shouldBreak(props, prev, next)) {
            // a cluster boundry exists, yield the current grapheme cluster
            yield [
                str.slice(i, j),
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
        if (cp > 0xFFFF) j += 1;
        prev = next;
    }
    // yield the final grapheme cluster
    yield [
        str.slice(i),
        // if last cluster is an emoji zwj sequence, its width is that of the first code point in the sequence
        (zwj && props[0] === ExtendedPictographic && isEmojiZwjSequence(cpoints)) ? fcw : cw,
    ];
};