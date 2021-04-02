const ansiRegex = require('ansi-regex'),
    { isFullWidthCodePoint, isZeroWidthCodePoint } = require('./codePoint');

const ansi = ansiRegex();

module.exports = (string) => {
    if (typeof string !== 'string' || string.length === 0) {
        return 0;
    }
    // strip all ansi control chars & normlize unicode
    const str = string.replace(ansi, '').normalize('NFC');
    // count string width
    let width = 0;
    for (let i = 0, n = str.length; i < n; i += 1) {
        const code = str.codePointAt(i);
        // ignore surrogates
        if (code > 0xFFFF) i += 1;
        // ignore zero width code points
        if (isZeroWidthCodePoint(code)) {
            continue;
        }
        width += isFullWidthCodePoint(code) ? 2 : 1;
    }
    return width;
};