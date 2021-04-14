const { graphemeBreakProperty, shouldBreak } = require('./graphemeBreak');

/**
 * Breaks a string into an array of grapheme clusters,
 * An implementation of UAX #29 grapheme cluster boundaries:
 * {@link https://www.unicode.org/reports/tr29/tr29-21.html#Grapheme_Cluster_Boundaries}
 * @param {string} string
 * @returns {string[]}
 */
module.exports = function splitChars(string) {
    if (typeof string !== 'string' || string.length === 0) {
        return [];
    }
    const n = string.length,
        result = [];
    let i = 0,
        props = [],
        cp = string.codePointAt(0),
        prev = graphemeBreakProperty(cp);
    for (let j = cp > 0xFFFF ? 2 : 1; j < n; j += 1) {
        cp = string.codePointAt(j);
        const next = graphemeBreakProperty(cp);
        if (shouldBreak(props, prev, next)) {
            props = [];
            result.push(string.slice(i, j));
            i = j;
        } else props.push(prev);
        // ignore surrogates
        if (cp > 0xFFFF) j += 1;
        prev = next;
    }
    result.push(string.slice(i));
    return result;
};