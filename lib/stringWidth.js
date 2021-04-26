const ansiRegex = require('ansi-regex'),
    codePointWidth = require('./codePoint'),
    { graphemeBreakProperty, shouldBreak, classes: { RI, ExtendedPictographic } } = require('./graphemeBreak'),
    { isEmojiSequence } = require('./emoji');

const ansi = ansiRegex();

/**
 * Get the visual width of a string
 * @param {string} string - input string to measure
 * @returns {number} - visual width of the string
 */
module.exports = function stringWidth(string) {
    if (typeof string !== 'string' || string.length === 0) {
        return 0;
    }
    // strip all ansi control chars & normlize unicode
    const str = string.replace(ansi, '').normalize('NFC');
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
        // get grapheme break property of the first code point
        prev = graphemeBreakProperty(cp);

    for (let i = cp > 0xFFFF ? 2 : 1, n = str.length; i < n; i += 1) {
        cp = str.codePointAt(i);
        // get grapheme break property of the next code point
        const next = graphemeBreakProperty(cp);
        // check if there is a cluster boundary between the two adjacent code points
        if (shouldBreak(props, prev, next)) {
            // if cluster is an emoji sequence, add only width of the first code point in the cluster
            width += (props[0] === ExtendedPictographic && isEmojiSequence(cpoints)) ? fcw : cw;
            // reset grapheme break properties array
            props = [];
            // initialize code points array for the next grapheme cluster
            cpoints = [cp];
            // measure width of the first code point in the next grapheme cluster
            fcw = codePointWidth(cp);
            // initialize total width of the next grapheme cluster
            cw = fcw;
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
        if (cp > 0xFFFF) i += 1;
        prev = next;
    }
    // if last cluster is an emoji sequence, add only width of the first code point in the cluster
    width += (props[0] === ExtendedPictographic && isEmojiSequence(cpoints)) ? fcw : cw;
    return width;
};