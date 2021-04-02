/**
 * Check if a given code point is full width
 * Code points are derived from {@link https://unicode.org/Public/13.0.0/ucd/EastAsianWidth.txt}
 * @param {number} code - unicode code point
 * @returns {boolean}
 */
function isFullWidthCodePoint(code) {
    // Basic Latin ... Georgian (0000 - 10FF)
    if (code < 0x1100) return false;
    // Hangul Jamo ... Mathematical Operators (1100 - 22FF)
    if (code < 0x231A) {
        return (code <= 0x115F); // [96]
    }
    // Miscellaneous Technical (2300 - 23FF)
    if (code < 0x2400) {
        return (
            (code <= 0x231B) // [2]
            || (code >= 0x2329 && code <= 0x232A) // [2]
            || (code >= 0x23E9 && code <= 0x23EC) // [4]
            || (code === 0x23F0) // [1]
            || (code === 0x23F3) // [1]
        );
    }
    // Control Pictures ... Geometric Shapes (2400 - 25FF)
    if (code < 0x25FF) {
        return (code >= 0x25FD); // [2]
    }
    // Miscellaneous Symbols (2600 - 26FF)
    if (code < 0x2700) {
        return (
            (code >= 0x2614 && code <= 0x2615) // [2]
            || (code >= 0x2648 && code <= 0x2653) // [12]
            || (code === 0x267F) // [1]
            || (code === 0x2693) // [1]
            || (code === 0x26A1) // [1]
            || (code >= 0x26AA && code <= 0x26AB) // [2]
            || (code >= 0x26BD && code <= 0x26BE) // [2]
            || (code >= 0x26C4 && code <= 0x26C5) // [2]
            || (code === 0x26CE) // [1]
            || (code === 0x26D4) // [1]
            || (code === 0x26EA) // [1]
            || (code >= 0x26F2 && code <= 0x26F5 && code !== 0x26F4) // [3]
            || (code === 0x26FA) // [1]
            || (code === 0x26FD) // [1]
        );
    }
    // Dingbats ... Supplemental Mathematical Operators (2700 - 2AFF)
    if (code < 0x2B1B) {
        return code <= 0x27BF && (
            code === 0x2705 // [1]
            || (code >= 0x270A && code <= 0x270B) // [2]
            || code === 0x2728 // [1]
            || code === 0x274C // [1]
            || code === 0x274E // [1]
            || (code >= 0x2753 && code <= 0x2757 && code !== 0x2756) // [4]
            || (code >= 0x2795 && code <= 0x2797) // [3]
            || code === 0x27B0 // [1]
            || code === 0x27BF // [1]
        );
    }
    // Miscellaneous Symbols and Arrows ... Supplemental Punctuation (2B00 - 2E7F)
    if (code < 0x2E80) {
        return code <= 0x2B55 && (code <= 0x2B1C || code === 0x2B50 || code === 0x2B55); // [4]
    }
    // CJK Radicals Supplement (2E80 - 2EFF)
    if (code < 0x2F00) {
        return (code <= 0x2EF3 && code !== 0x2E9A); // [115]
    }
    // Kangxi Radicals (2F00 - 2FDF)
    if (code < 0x2FF0) {
        return (code <= 0x2FD5); // [214]
    }
    // Ideographic Description Characters (2FF0 - 2FFF)
    if (code < 0x3000) {
        return (code <= 0x2FFB); // [12]
    }
    // CJK Symbols and Punctuation (3000 - 303F)
    if (code < 0x3041) {
        return (code <= 0x303E); // [62]
    }
    // Hiragana, Katakana (3040 - 30FF)
    if (code < 0x3100) {
        return (code <= 0x3096 || code >= 0x3099); // [189]
    }
    // Bopomofo (3100 - 312F)
    if (code < 0x3130) {
        return (code >= 0x3105); // [43]
    }
    // Hangul Compatibility Jamo (3130 - 318F)
    if (code < 0x3190) {
        return (code !== 0x3130 && code !== 0x318F); // [94]
    }
    // Kanbun ... CJK Strokes (3190 - 31EF)
    if (code < 0x31F0) {
        return (code <= 0x31E3); // [84]
    }
    // Katakana Phonetic Extensions ... CJK Unified Ideographs Extension A (31F0 - 4DBF)
    if (code < 0x4DC0) {
        return (code >= 0x3250 || (code <= 0x3247 && code !== 0x321F)); // [7111]
    }
    // Yijing Hexagram Symbols, CJK Unified Ideographs, Yi Syllables (4DC0 - A48F)
    if (code < 0xA48D) {
        return (code >= 0x4E00); // [22157]
    }
    // Yi Radicals (A490 - A4CF)
    if (code < 0xA4C7) {
        return (code >= 0xA490); // [55]
    }
    // Lisu ... Hangul Jamo Extended-A (A4D0 - A97F)
    if (code < 0xA97D) {
        return (code >= 0xA960); // [29]
    }
    // Javanese ... Hangul Syllables (A980 - D7AF)
    if (code < 0xD7A4) {
        return (code >= 0xAC00); // [11172]
    }
    // Hangul Jamo Extended-B ... Variation Selectors (D7B0 - FE0F)
    if (code < 0xFE10) {
        // CJK Compatibility Ideographs
        return (code >= 0xF900 && code <= 0xFAFF); // [512]
    }
    // Vertical Forms, Combining Half Marks (FE10 - FE2F)
    if (code < 0xFE30) {
        return (code <= 0xFE19); // [10]
    }
    // CJK Compatibility Forms, Small Form Variants (FE30 - FE6F)
    if (code < 0xFE6C) {
        return (code !== 0xFE53 && code !== 0xFE67); // [58]
    }
    // Arabic Presentation Forms-B ... Miao (FE70 - 16F9F)
    if (code < 0x16FE0) {
        // Halfwidth and Fullwidth Forms
        return (code <= 0xFFE6 && code >= 0xFF01 && (code <= 0xFF60 || code >= 0xFFE0)); // [103]
    }
    // Ideographic Symbols and Punctuation (16FE0 - 16FFF)
    if (code < 0x17000) {
        return (code <= 0x16FE4 || (code >= 0x16FF0 && code <= 0x16FF1)); // [7]
    }
    // Tangut ... Tangut Supplement (17000 - 18D8F)
    if (code < 0x1B000) {
        return code <= 0x18D08 && (
            code <= 0x187F7 // [6,136]
            || (code >= 0x18800 && code <= 0x18CD5) // [1,238]
            || code >= 0x18D00 // [9]
        );
    }
    // Kana Supplement ... Small Kana Extension (1B000 - 1B16F)
    if (code < 0x1B170) {
        return (
            code <= 0x1B11E // [287]
            || (code >= 0x1B150 && code <= 0x1B152) // [3]
            || (code >= 0x1B164 && code <= 0x1B167) // [4]
        );
    }
    // Nushu ... Arabic Mathematical Alphabetic Symbols (1B170 - 1EEFF)
    if (code < 0x1F000) {
        return (code <= 0x1B2FB); // [396]
    }
    // Mahjong Tiles, Domino Tiles, Playing Cards (1F000 - 1F0FF)
    if (code < 0x1F100) {
        return (code === 0x1F004 || code === 0x1F0CF); // [2]
    }
    // Enclosed Alphanumeric Supplement (1F100 - 1F1FF)
    if (code < 0x1F200) {
        return (code === 0x1F18E || (code >= 0x1F191 && code <= 0x1F19A)); // [11]
    }
    // Enclosed Ideographic Supplement (1F200 - 1F2FF)
    if (code < 0x1F300) {
        return (
            (code <= 0x1F202) // [3]
            || (code >= 0x1F210 && code <= 0x1F23B) // [44]
            || (code >= 0x1F240 && code <= 0x1F248) // [9]
            || (code >= 0x1F250 && code <= 0x1F251) // [2]
            || (code >= 0x1F260 && code <= 0x1F265) // [6]
        );
    }
    // Miscellaneous Symbols and Pictographs, Emoticons (1F300 - 1F64F)
    if (code < 0x1F650) {
        return (
            (code <= 0x1F320) // [33]
            || (code >= 0x1F5FB) // [85]
            || (code >= 0x1F32D && code <= 0x1F393 && code !== 0x1F336 && code !== 0x1F37D) // [101]
            || (code >= 0x1F3A0 && code <= 0x1F3CA) // [43]
            || (code >= 0x1F3CF && code <= 0x1F3D3) // [5]
            || (code >= 0x1F3E0 && code <= 0x1F3F0) // [17]
            || (code === 0x1F3F4) // [1]
            || (code >= 0x1F3F8 && code <= 0x1F4FC && code !== 0x1F43F && code !== 0x1F441) // [259]
            || (code >= 0x1F4FF && code <= 0x1F53D) // [63]
            || (code >= 0x1F54B && code <= 0x1F567 && code !== 0x1F54F) // [28]
            || (code === 0x1F57A) // [1]
            || (code >= 0x1F595 && code <= 0x1F596) // [2]
            || (code === 0x1F5A4) // [1]
        );
    }
    //  Ornamental Dingbats, Transport and Map Symbols (1F650 - 1F6FF)
    if (code < 0x1F6FD) {
        return code >= 0x1F680 && (
            (code <= 0x1F6C5) // [70]
            || (code === 0x1F6CC) // [1]
            || (code >= 0x1F6D0 && code <= 0x1F6D2) // [3]
            || (code >= 0x1F6D5 && code <= 0x1F6D7) // [3]
            || (code >= 0x1F6EB && code <= 0x1F6EC) // [2]
            || (code >= 0x1F6F4) // [9]
        );
    }
    // Alchemical Symbols, Geometric Shapes Extended, Supplemental Arrows-C (1F700 - 1F8FF)
    if (code < 0x1F90C) {
        return (code >= 0x1F7E0 && code <= 0x1F7EB); // [12]
    }
    // Supplemental Symbols and Pictographs (1F900 - 1F9FF)
    if (code < 0x1FA00) {
        return (code !== 0x1F93B && code !== 0x1F946 && code !== 0x1F979 && code !== 0x1F9CC); // [241]
    }
    // Chess Symbols, Symbols and Pictographs Extended-A (1FA00 - 1FAFF)
    if (code < 0x1FAD7) {
        return code >= 0x1FA70 && (
            (code <= 0x1FA74) // [5]
            || (code >= 0x1FA78 && code <= 0x1FA7A) // [3]
            || (code >= 0x1FA80 && code <= 0x1FA86) // [7]
            || (code >= 0x1FA90 && code <= 0x1FAA8) // [25]
            || (code >= 0x1FAB0 && code <= 0x1FAB6) // [7]
            || (code >= 0x1FAC0 && code <= 0x1FAC2) // [3]
            || (code >= 0x1FAD0) // [7]
        );
    }
    // Symbols for Legacy Computing ... CJK Compatibility Ideographs Supplement (1FB00 - 2FA1F)
    if (code < 0x30000) {
        return (code >= 0x20000 && code <= 0x2FFFD); // [65534]
    }
    // CJK Unified Ideographs Extension G (30000 - 3134F)
    return (code <= 0x3FFFD); // [65534]
}

/**
 * Check if a given code point is zero width
 * Adapted from {@link https://github.com/nodejs/node/blob/master/lib/internal/util/inspect.js}
 * @param {number} code - unicode code point
 * @returns {boolean}
 */
function isZeroWidthCodePoint(code) {
    return (
        // C0 control codes
        code <= 0x1F // [32]
        // C1 control codes
        || (code >= 0x7F && code <= 0x9F) // [33]
        // Combining Diacritical Marks
        || (code >= 0x0300 && code <= 0x036F) // [112]
        // General Punctuation
        || (code >= 0x200B && code <= 0x200F) // [5]
        // Combining Diacritical Marks for Symbols
        || (code >= 0x20D0 && code <= 0x20FF) // [48]
        // Variation Selectors
        || (code >= 0xFE00 && code <= 0xFE0F) // [16]
        // Combining Half Marks
        || (code >= 0xFE20 && code <= 0xFE2F) // [16]
        // Variation Selectors Supplement
        || (code >= 0xE0100 && code <= 0xE01EF) // [240]
    );
}

module.exports = {
    isFullWidthCodePoint,
    isZeroWidthCodePoint,
};