const stripAnsi = require('./stripAnsi'),
    { graphemeBreakProperty, shouldBreak } = require('./graphemeBreak');

/**
 * Get the character length of a string
 * This function is an implementation of UAX #29 grapheme cluster boundary splitting:
 * {@link https://www.unicode.org/reports/tr29/tr29-21.html#Grapheme_Cluster_Boundaries}
 * @param {string} string - input string
 * @returns {number} - character length of the string
 */
module.exports = function stringLength(string) {
    if (typeof string !== 'string') return 0;
    // strip all ansi control chars & normlize unicode
    const str = stripAnsi(string).normalize('NFC');
    // check if input is an empty string after stripping ansi
    if (str.length === 0) return 0;
    // initialize character count
    let count = 1,
        // initialize array to store grapheme break properties
        props = [],
        // get first code point
        cp = str.codePointAt(0),
        // get grapheme break property of the first code point
        prev = graphemeBreakProperty(cp);
    // iterate through each code point in the string
    for (let i = cp > 0xFFFF ? 2 : 1, n = str.length; i < n; i += 1) {
        cp = str.codePointAt(i);
        // get grapheme break property of the next code point
        const next = graphemeBreakProperty(cp);
        // check if there is a cluster boundary between the two adjacent code points
        if (shouldBreak(props, prev, next)) {
            // a cluster boundry exists, increment the character count
            count += 1;
            // reset grapheme break properties array
            props = [];
        } else props.push(prev);
        // ignore surrogates
        if (cp > 0xFFFF) i += 1;
        prev = next;
    }
    // return the character count
    return count;
};