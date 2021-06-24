const stringWidth = require('./stringWidth'),
    stringLength = require('./stringLength'),
    splitChars = require('./splitChars'),
    charWidths = require('./charWidths'),
    stripAnsi = require('./stripAnsi'),
    codePointWidth = require('./codePoint'),
    splitLines = require('./splitLines'),
    { sliceChars, sliceColumns } = require('./sliceString'),
    spliceChars = require('./spliceChars'),
    wordWrap = require('./wordWrap');

module.exports = {
    stringWidth,
    stringLength,
    splitChars,
    charWidths,
    stripAnsi,
    codePointWidth,
    splitLines,
    sliceChars,
    sliceColumns,
    spliceChars,
    wordWrap,
};