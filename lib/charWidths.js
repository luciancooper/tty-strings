const codePointWidth = require('./codePoint'),
    { graphemeBreakProperty, shouldBreak, classes: { RI, ExtendedPictographic } } = require('./graphemeBreak'),
    { isEmojiSequence } = require('./emoji');

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
        // get grapheme break property of the first code point
        prev = graphemeBreakProperty(cp);

    for (let j = cp > 0xFFFF ? 2 : 1, n = str.length; j < n; j += 1) {
        cp = str.codePointAt(j);
        // get grapheme break property of the next code point
        const next = graphemeBreakProperty(cp);
        // check if there is a cluster boundary between the two adjacent code points
        if (shouldBreak(props, prev, next)) {
            // a cluster boundry exists, yield the current grapheme cluster
            yield [
                str.slice(i, j),
                // if cluster is an emoji sequence, its width is that of the first code point in the sequence
                (props[0] === ExtendedPictographic && isEmojiSequence(cpoints)) ? fcw : cw,
            ];
            // reset grapheme break properties array
            props = [];
            // initialize code points array for the next grapheme cluster
            cpoints = [cp];
            // measure width of the first code point in the next grapheme cluster
            fcw = codePointWidth(cp);
            // initialize total width of the next grapheme cluster
            cw = fcw;
            // set lower string index of the next cluster
            i = j;
        } else {
            // ensure two code points are not a regional indicator sequence
            if (!(prev === RI && next === RI)) {
                // increment width of the current grapheme cluster
                cw += codePointWidth(cp);
            }
            // add code point to code points array for the current grapheme cluster
            cpoints.push(cp);
            // add grapheme break property to props array
            props.push(prev);
        }
        // ignore surrogates
        if (cp > 0xFFFF) j += 1;
        prev = next;
    }
    // yield the final grapheme cluster
    yield [
        str.slice(i),
        // if last cluster is an emoji sequence, its width is that of the first code point in the sequence
        (props[0] === ExtendedPictographic && isEmojiSequence(cpoints)) ? fcw : cw,
    ];
};