const { graphemeBreakProperty, shouldBreak } = require('./graphemeBreak');

/**
 * A generator that splits a string into its component grapheme clusters
 * This function is an implementation of UAX #29 grapheme cluster boundary splitting:
 * {@link https://www.unicode.org/reports/tr29/tr29-21.html#Grapheme_Cluster_Boundaries}
 * @param {string} string - input string to split
 * @yields {string}
 */
module.exports = function* splitChars(string) {
    if (typeof string !== 'string' || string.length === 0) return;
    // lower string index of the first grapheme cluster
    let i = 0,
        // initialize array to store grapheme break properties
        props = [],
        // get first code point
        cp = string.codePointAt(0),
        // get grapheme break property of the first code point
        prev = graphemeBreakProperty(cp);

    for (let j = cp > 0xFFFF ? 2 : 1, n = string.length; j < n; j += 1) {
        cp = string.codePointAt(j);
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
};