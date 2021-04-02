const stringWidth = require('./stringWidth'),
    { isFullWidthCodePoint, isZeroWidthCodePoint } = require('./codePoint');

module.exports = {
    stringWidth,
    isFullWidthCodePoint,
    isZeroWidthCodePoint,
};