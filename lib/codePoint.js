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
 * Code points include those with general category values of Mn, Me, and Cc,
 * as well as all code points with the `Default_Ignorable_Code_Point` property
 * General category values are derived from:
 * {@link https://unicode.org/Public/13.0.0/ucd/extracted/DerivedGeneralCategory.txt}
 * `Default_Ignorable_Code_Point` values are derived from:
 * {@link https://unicode.org/Public/13.0.0/ucd/DerivedCoreProperties.txt}
 * @param {number} code - unicode code point
 * @returns {boolean}
 */
function isZeroWidthCodePoint(code) {
    // Basic Latin ... Combining Diacritical Marks (0000 - 036F)
    if (code < 0x0370) {
        return code <= 0x009F ? (
            // C0 control codes
            code <= 0x001F // // Cc [32]
            // C1 control codes
            || code >= 0x007F // Cc [33]
        ) : (
            // Combining Diacritical Marks
            code >= 0x0300 // Mn [112]
            // Soft hyphen
            || code === 0x00AD // Cf [1]
        );
    }
    // Greek and Coptic ... Gujarati (0370 - 0AFF)
    if (code < 0x0B00) {
        return code < 0x0591 ? (
            // Cyrillic
            code >= 0x0483 && code <= 0x0489 // Mn [5] & Me [2]
        ) : code < 0x0610 ? (
            // Hebrew
            (code <= 0x05C2 && code !== 0x05BE && code !== 0x05C0) // Mn [48]
            || (code >= 0x05C4 && code <= 0x05C7 && code !== 0x05C6) // Mn [3]
        ) : code < 0x06EE ? (
            // Arabic
            (code <= 0x061C && code !== 0x061B) // Mn [11] & Cf [1]
            || (code >= 0x064B && code <= 0x065F) // Mn [21]
            || code === 0x0670 // Mn [1]
            || (code >= 0x06D6 && code <= 0x06DC) // Mn [7]
            || (code >= 0x06DF && code <= 0x06E4) // Mn [6]
            || (code >= 0x06E7 && code !== 0x06E9) // Mn [6]
        ) : code < 0x074B ? (
            // Syriac
            code === 0x0711 // Mn [1]
            || code >= 0x0730 // Mn [27]
        ) : code < 0x0816 ? (
            // Thaana
            (code >= 0x07A6 && code <= 0x07B0) // Mn [11]
            // NKo
            || (code >= 0x07EB && code <= 0x07F3) // Mn [9]
            || code === 0x07FD // Mn [1]
        ) : code < 0x082E ? (
            // Samaritan
            (code <= 0x0823 && code !== 0x081A) // Mn [13]
            || (code >= 0x0825 && code !== 0x0828) // Mn [8]
        ) : code < 0x0903 ? (
            // Mandaic
            (code >= 0x0859 && code <= 0x085B) // Mn [3]
            // Arabic Extended-A
            || (code >= 0x08D3 && code !== 0x08E2) // Mn [47]
        ) : code < 0x0964 ? (
            // Devanagari
            (code >= 0x093A && code <= 0x093C && code !== 0x093B) // Mn [2]
            || (code >= 0x0941 && code <= 0x0948) // Mn [8]
            || code === 0x094D // Mn [1]
            || (code >= 0x0951 && code <= 0x0957) // Mn [7]
            || code >= 0x0962 // Mn [2]
        ) : code < 0x0A01 ? (
            // Bengali
            code === 0x0981 // Mn [1]
            || code === 0x09BC // Mn [1]
            || (code >= 0x09C1 && code <= 0x09C4) // Mn [4]
            || code === 0x09CD // Mn [1]
            || (code >= 0x09E2 && code <= 0x09E3) // Mn [2]
            || code === 0x09FE // Mn [1]
        ) : code < 0x0A81 ? (
            // Gurmukhi
            code <= 0x0A02 // Mn [2]
            || code === 0x0A3C // Mn [1]
            || (code >= 0x0A41 && code <= 0x0A42) // Mn [2]
            || (code >= 0x0A47 && code <= 0x0A48) // Mn [2]
            || (code >= 0x0A4B && code <= 0x0A4D) // Mn [3]
            || code === 0x0A51 // Mn [1]
            || (code >= 0x0A70 && code <= 0x0A71) // Mn [2]
            || code === 0x0A75 // Mn [1]
        ) : (
            // Gujarati
            code <= 0x0A82 // Mn [2]
            || code === 0x0ABC // Mn [1]
            || (code >= 0x0AC1 && code <= 0x0AC8 && code !== 0x0AC6) // Mn [7]
            || code === 0x0ACD // Mn [1]
            || (code >= 0x0AE2 && code <= 0x0AE3) // Mn [2]
            || code >= 0x0AFA // Mn [6]
        );
    }
    // Oriya ... Myanmar (0B00 - 109F)
    if (code < 0x10A0) {
        return code < 0x0B64 ? (
            // Oriya
            code === 0x0B01 // Mn [1]
            || code === 0x0B3C // Mn [1]
            || (code >= 0x0B3F && code <= 0x0B44 && code !== 0x0B40) // Mn [5]
            || code === 0x0B4D // Mn [1]
            || (code >= 0x0B55 && code <= 0x0B56) // Mn [2]
            || code >= 0x0B62 // Mn [2]
        ) : code < 0x0C00 ? (
            // Tamil
            code === 0x0B82 // Mn [1]
            || code === 0x0BC0 // Mn [1]
            || code === 0x0BCD // Mn [1]
        ) : code < 0x0C64 ? (
            // Telugu
            code === 0x0C00 // Mn [1]
            || code === 0x0C04 // Mn [1]
            || (code >= 0x0C3E && code <= 0x0C40) // Mn [3]
            || (code >= 0x0C46 && code <= 0x0C4D && code !== 0x0C49) // Mn [7]
            || (code >= 0x0C55 && code <= 0x0C56) // Mn [2]
            || code >= 0x0C62 // Mn [2]
        ) : code < 0x0D00 ? (
            // Kannada
            code === 0x0C81 // Mn [1]
            || code === 0x0CBC // Mn [1]
            || code === 0x0CBF // Mn [1]
            || code === 0x0CC6 // Mn [1]
            || (code >= 0x0CCC && code <= 0x0CCD) // Mn [2]
            || (code >= 0x0CE2 && code <= 0x0CE3) // Mn [2]
        ) : code < 0x0D64 ? (
            // Malayalam
            code <= 0x0D01 // Mn [2]
            || (code >= 0x0D3B && code <= 0x0D3C) // Mn [2]
            || (code >= 0x0D41 && code <= 0x0D44) // Mn [4]
            || code === 0x0D4D // Mn [1]
            || code >= 0x0D62 // Mn [2]
        ) : code < 0x0DD7 ? (
            // Sinhala
            code === 0x0D81 // Mn [1]
            || code === 0x0DCA // Mn [1]
            || (code >= 0x0DD2 && code !== 0x0DD5) // Mn [4]
        ) : code < 0x0E4F ? (
            // Thai
            code === 0x0E31 // Mn [1]
            || (code >= 0x0E34 && code <= 0x0E3A) // Mn [7]
            || code >= 0x0E47 // Mn [8]
        ) : code < 0x0F18 ? (
            // Lao
            code === 0x0EB1 // Mn [1]
            || (code >= 0x0EB4 && code <= 0x0EBC) // Mn [9]
            || (code >= 0x0EC8 && code <= 0x0ECD) // Mn [6]
        ) : code < 0x102D ? (
            // Tibetan
            code <= 0x0F19 // Mn [2]
            || code === 0x0F35 // Mn [1]
            || code === 0x0F37 // Mn [1]
            || code === 0x0F39 // Mn [1]
            || (code >= 0x0F71 && code <= 0x0F87 && code !== 0x0F7F && code !== 0x0F85) // Mn [21]
            || (code >= 0x0F8D && code <= 0x0FBC && code !== 0x0F98) // Mn [47]
            || code === 0x0FC6 // Mn [1]
        ) : (
            // Myanmar
            (code <= 0x103A && code !== 0x1031 && code !== 0x1038) // Mn [12]
            || (code >= 0x103D && code <= 0x103E) // Mn [2]
            || (code >= 0x1058 && code <= 0x1059) // Mn [2]
            || (code >= 0x105E && code <= 0x1060) // Mn [3]
            || (code >= 0x1071 && code <= 0x1074) // Mn [4]
            || code === 0x1082 // Mn [1]
            || (code >= 0x1085 && code <= 0x1086) // Mn [2]
            || code === 0x108D // Mn [1]
            || code === 0x109D // Mn [1]
        );
    }
    // Georgian ... Sundanese Supplement (10A0 - 1CCF)
    if (code < 0x1CD0) {
        return code < 0x1712 ? (
            // Hangul Jamo
            (code >= 0x115F && code <= 0x1160) // Lo [2]
            // Ethiopic
            || (code >= 0x135D && code <= 0x135F) // Mn [3]
        ) : code < 0x17B4 ? (
            // Tagalog
            code <= 0x1714 // Mn [3]
            // Hanunoo
            || (code >= 0x1732 && code <= 0x1734) // Mn [3]
            // Buhid
            || (code >= 0x1752 && code <= 0x1753) // Mn [2]
            // Tagbanwa
            || (code >= 0x1772 && code <= 0x1773) // Mn [2]
        ) : code < 0x180B ? (
            // Khmer
            (code <= 0x17BD && code !== 0x17B6) // Mn [9]
            || code === 0x17C6 // Mn [1]
            || (code >= 0x17C9 && code <= 0x17D3) // Mn [11]
            || code === 0x17DD // Mn [1]
        ) : code < 0x1920 ? (
            // Mongolian
            code <= 0x180E // Mn [3] & Cf [1]
            || (code >= 0x1885 && code <= 0x1886) // Mn [2]
            || code === 0x18A9 // Mn [1]
        ) : code < 0x193C ? (
            // Limbu
            code <= 0x1922 // Mn [3]
            || (code >= 0x1927 && code <= 0x1928) // Mn [2]
            || code === 0x1932 // Mn [1]
            || code >= 0x1939 // Mn [3]
        ) : code < 0x1A56 ? (
            // Buginese
            (code >= 0x1A17 && code <= 0x1A18) // Mn [2]
            || code === 0x1A1B // Mn [1]
        ) : code < 0x1AB0 ? (
            // Tai Tham
            (code <= 0x1A5E && code !== 0x1A57) // Mn [8]
            || code === 0x1A60 // Mn [1]
            || code === 0x1A62 // Mn [1]
            || (code >= 0x1A65 && code <= 0x1A6C) // Mn [8]
            || (code >= 0x1A73 && code <= 0x1A7C) // Mn [10]
            || code === 0x1A7F // Mn [1]
        ) : code < 0x1B00 ? (
            // Combining Diacritical Marks Extended
            code <= 0x1AC0 // Mn [16] & Me [1]
        ) : code < 0x1B80 ? (
            // Balinese
            code <= 0x1B03 // Mn [4]
            || (code >= 0x1B34 && code <= 0x1B3A && code !== 0x1B35) // Mn [6]
            || code === 0x1B3C // Mn [1]
            || code === 0x1B42 // Mn [1]
            || (code >= 0x1B6B && code <= 0x1B73) // Mn [9]
        ) : code < 0x1BAE ? (
            // Sundanese
            code <= 0x1B81 // Mn [2]
            || (code >= 0x1BA2 && code <= 0x1BA5) // Mn [4]
            || (code >= 0x1BA8 && code !== 0x1BAA) // Mn [5]
        ) : code < 0x1BF2 ? (
            // Batak
            (code >= 0x1BE6 && code <= 0x1BE9 && code !== 0x1BE7) // Mn [3]
            || (code >= 0x1BED && code !== 0x1BEE) // Mn [4]
        ) : (
            // Lepcha
            (code >= 0x1C2C && code <= 0x1C33) // Mn [8]
            || (code >= 0x1C36 && code <= 0x1C37) // Mn [2]
        );
    }
    // Vedic Extensions ... Latin Extended-D (1CD0 - A7FF)
    if (code < 0xA800) {
        return code < 0x1CFA ? (
            // Vedic Extensions
            (code <= 0x1CE0 && code !== 0x1CD3) // Mn [16]
            || (code >= 0x1CE2 && code <= 0x1CE8) // Mn [7]
            || code === 0x1CED // Mn [1]
            || code === 0x1CF4 // Mn [1]
            || code >= 0x1CF8 // Mn [2]
        ) : code < 0x200B ? (
            // Combining Diacritical Marks Supplement
            code >= 0x1DC0 && code <= 0x1DFF && code !== 0x1DFA // Mn [63]
        ) : code < 0x2070 ? (
            // General Punctuation
            code <= 0x200F // Cf [5]
            || (code >= 0x202A && code <= 0x202E) // Cf [5]
            || (code >= 0x2060) // Cf [15] & Cn [1]
        ) : code < 0x2CEF ? (
            // Combining Diacritical Marks for Symbols
            code >= 0x20D0 && code <= 0x20F0 // Mn [26] & Me [7]
        ) : code < 0x2E00 ? (
            // Coptic
            code <= 0x2CF1 // Mn [3]
            // Tifinagh
            || code === 0x2D7F // Mn [1]
            // Cyrillic Extended-A
            || code >= 0x2DE0 // Mn [32]
        ) : code < 0xA66F ? (
            // CJK Symbols and Punctuation
            (code >= 0x302A && code <= 0x302D) // Mn [4]
            // Hiragana
            || (code >= 0x3099 && code <= 0x309A) // Mn [2]
            // Hangul Compatibility Jamo
            || code === 0x3164 // Lo [1]
        ) : (
            // Cyrillic Extended-B
            (code <= 0xA67D && code !== 0xA673) // Mn [11] & Me [3]
            || (code >= 0xA69E && code <= 0xA69F) // Mn [2]
            // Bamum
            || (code >= 0xA6F0 && code <= 0xA6F1) // Mn [2]
        );
    }
    // Syloti Nagri ... Arabic Presentation Forms-A (A800 - FDFF)
    if (code < 0xFE00) {
        return code < 0xA8C4 ? (
            // Syloti Nagri
            code === 0xA802 // Mn [1]
            || code === 0xA806 // Mn [1]
            || code === 0xA80B // Mn [1]
            || (code >= 0xA825 && code <= 0xA826) // Mn [2]
            || code === 0xA82C // Mn [1]
        ) : code < 0xA980 ? (
            // Saurashtra
            code <= 0xA8C5 // Mn [2]
            // Devanagari Extended
            || (code >= 0xA8E0 && code <= 0xA8F1) // Mn [18]
            || code === 0xA8FF // Mn [1]
            // Kayah Li
            || (code >= 0xA926 && code <= 0xA92D) // Mn [8]
            // Rejang
            || (code >= 0xA947 && code <= 0xA951) // Mn [11]
        ) : code < 0xAA29 ? (
            // Javanese
            code <= 0xA982 // Mn [3]
            || code === 0xA9B3 // Mn [1]
            || (code >= 0xA9B6 && code <= 0xA9B9) // Mn [4]
            || (code >= 0xA9BC && code <= 0xA9BD) // Mn [2]
            // Myanmar Extended-B
            || code === 0xA9E5 // Mn [1]
        ) : code < 0xAAB0 ? (
            // Cham
            code <= 0xAA2E // Mn [6]
            || (code >= 0xAA31 && code <= 0xAA32) // Mn [2]
            || (code >= 0xAA35 && code <= 0xAA36) // Mn [2]
            || code === 0xAA43 // Mn [1]
            || code === 0xAA4C // Mn [1]
            // Myanmar Extended-A
            || code === 0xAA7C // Mn [1]
        ) : code < 0xAAC2 ? (
            // Tai Viet
            (code <= 0xAAB4 && code !== 0xAAB1) // Mn [5]
            || (code >= 0xAAB7 && code <= 0xAAB8) // Mn [2]
            || (code >= 0xAABE && code !== 0xAAC0) // Mn [3]
        ) : code < 0xABC0 ? (
            // Meetei Mayek Extensions
            (code >= 0xAAEC && code <= 0xAAED) // Mn [2]
            || code === 0xAAF6 // Mn [1]
        ) : code < 0xAC00 ? (
            // Meetei Mayek
            code === 0xABE5 // Mn [1]
            || code === 0xABE8 // Mn [1]
            || code === 0xABED // Mn [1]
        ) : (
            // Alphabetic Presentation Forms
            code === 0xFB1E // Mn [1]
        );
    }
    // Variation Selectors ... Khudawadi (FE00 - 112FF)
    if (code < 0x11300) {
        return code < 0xFE30 ? (
            // Variation Selectors
            code <= 0xFE0F // Mn [16]
            // Combining Half Marks
            || code >= 0xFE20 // Mn [16]
        ) : code < 0x101D0 ? (
            // Arabic Presentation Forms-B
            code === 0xFEFF // Cf [1]
            // Halfwidth and Fullwidth Forms
            || code === 0xFFA0 // Lo [1]
            // Specials
            || (code >= 0xFFF0 && code <= 0xFFF8) // Cn [9]
        ) : code < 0x10A01 ? (
            // Phaistos Disc
            code === 0x101FD // Mn [1]
            // Coptic Epact Numbers
            || code === 0x102E0 // Mn [1]
            // Old Permic
            || (code >= 0x10376 && code <= 0x1037A) // Mn [5]
        ) : code < 0x10AE5 ? (
            // Kharoshthi
            (code <= 0x10A06 && code !== 0x10A04) // Mn [5]
            || (code >= 0x10A0C && code <= 0x10A0F) // Mn [4]
            || (code >= 0x10A38 && code <= 0x10A3A) // Mn [3]
            || code === 0x10A3F // Mn [1]
        ) : code < 0x10D28 ? (
            // Manichaean
            code <= 0x10AE6 // Mn [2]
            // Hanifi Rohingya
            || code >= 0x10D24 // Mn [4]
        ) : code < 0x10F51 ? (
            // Yezidi
            (code >= 0x10EAB && code <= 0x10EAC) // Mn [2]
            // Sogdian
            || code >= 0x10F46 // Mn [11]
        ) : code < 0x1107F ? (
            // Brahmi
            code === 0x11001 // Mn [1]
            || (code >= 0x11038 && code <= 0x11046) // Mn [15]
        ) : code < 0x11100 ? (
            // Kaithi
            code <= 0x11081 // Mn [3]
            || (code >= 0x110B3 && code <= 0x110B6) // Mn [4]
            || (code >= 0x110B9 && code <= 0x110BA) // Mn [2]
        ) : code < 0x11180 ? (
            // Chakma
            code <= 0x11102 // Mn [3]
            || (code >= 0x11127 && code <= 0x11134 && code !== 0x1112C) // Mn [13]
            // Mahajani
            || code === 0x11173 // Mn [1]
        ) : code < 0x1122F ? (
            // Sharada
            code <= 0x11181 // Mn [2]
            || (code >= 0x111B6 && code <= 0x111BE) // Mn [9]
            || (code >= 0x111C9 && code <= 0x111CC) // Mn [4]
            || code === 0x111CF // Mn [1]
        ) : code < 0x11280 ? (
            // Khojki
            code <= 0x11231 // Mn [3]
            || (code >= 0x11234 && code <= 0x11237 && code !== 0x11235) // Mn [3]
            || code === 0x1123E // Mn [1]
        ) : (
            // Khudawadi
            code === 0x112DF // Mn [1]
            || (code >= 0x112E3 && code <= 0x112EA) // Mn [8]
        );
    }
    // Grantha ... Gunjala Gondi (11300 - 11DAF)
    if (code < 0x11EE0) {
        return code < 0x11375 ? (
            // Grantha
            code <= 0x11301 // Mn [2]
            || (code >= 0x1133B && code <= 0x1133C) // Mn [2]
            || code === 0x11340 // Mn [1]
            || (code >= 0x11366 && code <= 0x1136C) // Mn [7]
            || code >= 0x11370 // Mn [5]
        ) : code < 0x114B3 ? (
            // Newa
            (code >= 0x11438 && code <= 0x1143F) // Mn [8]
            || (code >= 0x11442 && code <= 0x11446 && code !== 0x11445) // Mn [4]
            || code === 0x1145E // Mn [1]
        ) : code < 0x114C4 ? (
            // Tirhuta
            (code <= 0x114BA && code !== 0x114B9) // Mn [7]
            || (code >= 0x114BF && code !== 0x114C1) // Mn [4]
        ) : code < 0x115DE ? (
            // Siddham
            code >= 0x115B2 && (
                code <= 0x115B5 // Mn [4]
                || (code >= 0x115BC && code <= 0x115C0 && code !== 0x115BE) // Mn [4]
                || code >= 0x115DC // Mn [2]
            )
        ) : code < 0x11641 ? (
            // Modi
            code >= 0x11633 && (
                code <= 0x1163A // Mn [8]
                || (code >= 0x1163D && code !== 0x1163E) // Mn [3]
            )
        ) : code < 0x116B8 ? (
            // Takri
            code === 0x116AB // Mn [1]
            || code === 0x116AD // Mn [1]
            || (code >= 0x116B0 && code !== 0x116B6) // Mn [7]
        ) : code < 0x1172C ? (
            // Ahom
            (code >= 0x1171D && code <= 0x1171F) // Mn [3]
            || (code >= 0x11722 && code !== 0x11726) // Mn [9]
        ) : code < 0x119D4 ? (
            code <= 0x1183A ? (
                // Dogra
                code >= 0x1182F && code !== 0x11838 // Mn [11]
            ) : (code >= 0x1193B && (
                // Dives Akuru
                (code <= 0x1193E && code !== 0x1193D) // Mn [3]
                || code === 0x11943 // Mn [1]
            ))
        ) : code < 0x11A01 ? (
            // Nandinagari
            code <= 0x119D7 // Mn [4]
            || (code >= 0x119DA && code <= 0x119DB) // Mn [2]
            || code === 0x119E0 // Mn [1]
        ) : code < 0x11A51 ? (
            // Zanabazar Square
            code <= 0x11A0A // Mn [10]
            || (code >= 0x11A33 && code <= 0x11A38) // Mn [6]
            || (code >= 0x11A3B && code <= 0x11A3E) // Mn [4]
            || code === 0x11A47 // Mn [1]
        ) : code < 0x11A9A ? (
            // Soyombo
            code <= 0x11A56 // Mn [6]
            || (code >= 0x11A59 && code <= 0x11A5B) // Mn [3]
            || (code >= 0x11A8A && code !== 0x11A97) // Mn [15]
        ) : code < 0x11C92 ? (
            // Bhaiksuki
            code >= 0x11C30 && (
                (code <= 0x11C3D && code !== 0x11C37) // Mn [13]
                || code === 0x11C3F // Mn [1]
            )
        ) : code < 0x11CB7 ? (
            // Marchen
            code <= 0x11CA7 // Mn [22]
            || (code >= 0x11CAA && code <= 0x11CB0) // Mn [7]
            || (code >= 0x11CB2 && code !== 0x11CB4) // Mn [4]
        ) : code < 0x11D48 ? (
            // Masaram Gondi
            (code >= 0x11D31 && code <= 0x11D36) // Mn [6]
            || (code >= 0x11D3A && code <= 0x11D3D && code !== 0x11D3B) // Mn [3]
            || (code >= 0x11D3F && code !== 0x11D46) // Mn [8]
        ) : (
            // Gunjala Gondi
            (code >= 0x11D90 && code <= 0x11D91) // Mn [2]
            || code === 0x11D95 // Mn [1]
            || code === 0x11D97 // Mn [1]
        );
    }
    // Makasar ... Adlam (11EE0 - 1E95F)
    if (code < 0x1E94B) {
        return code < 0x16AD0 ? (
            // Makasar
            code <= 0x11EF4 && code >= 0x11EF3 // Mn [2]
        ) : code < 0x16F00 ? (
            code <= 0x16B36 && (
                // Bassa Vah
                (code >= 0x16AF0 && code <= 0x16AF4) // Mn [5]
                // Pahawh Hmong
                || code >= 0x16B30 // Mn [7]
            )
        ) : code < 0x17000 ? (
            // Miao
            code === 0x16F4F // Mn [1]
            || (code >= 0x16F8F && code <= 0x16F92) // Mn [4]
            // Ideographic Symbols and Punctuation
            || code === 0x16FE4 // Mn [1]
        ) : code < 0x1D167 ? (
            code >= 0x1BC9D && code <= 0x1BCA3 && (
                // Duployan
                code <= 0x1BC9E // Mn [2]
                // Shorthand Format Controls
                || code >= 0x1BCA0 // Cf [4]
            )
        ) : code < 0x1D1AE ? (
            // Musical Symbols
            code <= 0x1D169 // Mn [3]
            || (code >= 0x1D173 && code <= 0x1D182) // Cf [8] & Mn [8]
            || (code >= 0x1D185 && code <= 0x1D18B) // Mn [7]
            || code >= 0x1D1AA // Mn [4]
        ) : code < 0x1D800 ? (
            // Ancient Greek Musical Notation
            code <= 0x1D244 && code >= 0x1D242 // Mn [3]
        ) : code < 0x1E000 ? (
            // Sutton SignWriting
            code >= 0x1DA00 && (
                code <= 0x1DA36 // Mn [55]
                || (code >= 0x1DA3B && code <= 0x1DA6C) // Mn [50]
                || code === 0x1DA75 // Mn [1]
                || code === 0x1DA84 // Mn [1]
                || (code >= 0x1DA9B && code <= 0x1DAAF && code !== 0x1DAA0) // Mn [20]
            )
        ) : code < 0x1E02B ? (
            // Glagolitic Supplement
            (code <= 0x1E018 && code !== 0x1E007) // Mn [24]
            || (code >= 0x1E01B && code <= 0x1E021) // Mn [7]
            || (code >= 0x1E023 && code !== 0x1E025) // Mn [7]
        ) : (
            // Nyiakeng Puachue Hmong
            (code >= 0x1E130 && code <= 0x1E136) // Mn [7]
            // Wancho
            || (code >= 0x1E2EC && code <= 0x1E2EF) // Mn [4]
            // Mende Kikakui
            || (code >= 0x1E8D0 && code <= 0x1E8D6) // Mn [7]
            // Adlam
            || code >= 0x1E944 // Mn [7]
        );
    }
    // Tags, Variation Selectors Supplement (E0000 - E01EF)
    return (code >= 0xE0000 && code <= 0xE0FFF); // Cn [3,759] & Cf [97] & Mn [240]
}

module.exports = {
    isFullWidthCodePoint,
    isZeroWidthCodePoint,
};