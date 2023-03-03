/**
 * Get the visual width of a unicode code point
 * Full width code points are derived from {@link https://unicode.org/Public/13.0.0/ucd/EastAsianWidth.txt}
 * Zero width code points include those with general category values of Mn, Me, and Cc,
 * which are derived from {@link https://unicode.org/Public/13.0.0/ucd/extracted/DerivedGeneralCategory.txt}
 * As well as all code points with the `Default_Ignorable_Code_Point` property,
 * which are derived from {@link https://unicode.org/Public/13.0.0/ucd/DerivedCoreProperties.txt}
 * @param {number} code - unicode code point
 * @returns {number} - 2 for full width, 0 for zero width, & 1 for everything else
 */
function codePointWidth(code) {
    // Basic Latin ... Combining Diacritical Marks (0000 - 036F)
    if (code < 0x0370) {
        return (code <= 0x009F ? (
            // C0 control codes
            code <= 0x001F // // Cc [32]
            // C1 control codes
            || code >= 0x007F // Cc [33]
        ) : (
            // Combining Diacritical Marks
            code >= 0x0300 // Mn [112]
            // Soft hyphen
            || code === 0x00AD // Cf [1]
        )) ? 0 : 1;
    }
    // Greek and Coptic ... Gujarati (0370 - 0AFF)
    if (code < 0x0B00) {
        return (code < 0x0591 ? (
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
            // Arabic Extended-B
            || (code >= 0x0898 && code <= 0x089F) // Mn [8]
            // Arabic Extended-A
            || (code >= 0x08CA && code !== 0x08E2) // Mn [56]
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
        )) ? 0 : 1;
    }
    // Oriya ... Myanmar (0B00 - 109F)
    if (code < 0x10A0) {
        return (code < 0x0B64 ? (
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
            || code === 0x0C3C // Mn [1]
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
            || (code >= 0x0EC8 && code <= 0x0ECE) // Mn [7]
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
        )) ? 0 : 1;
    }
    // Georgian ... Tai Tham (10A0 - 1AAF)
    if (code < 0x1AB0) {
        return code < 0x1712 ? (
            code <= 0x1160 ? (
                // Hangul Jamo
                code >= 0x115F ? 0 // Lo [2]
                    : code >= 0x1100 ? 2 : 1 // W [96]
            ) : (
                // Ethiopic
                code >= 0x135D && code <= 0x135F // Mn [3]
            ) ? 0 : 1
        ) : (code < 0x17B4 ? (
            // Tagalog
            code <= 0x1714 // Mn [3]
            // Hanunoo
            || (code >= 0x1732 && code <= 0x1733) // Mn [2]
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
            code <= 0x180F // Mn [4] & Cf [1]
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
        ) : (
            // Tai Tham
            (code <= 0x1A5E && code !== 0x1A57) // Mn [8]
            || code === 0x1A60 // Mn [1]
            || code === 0x1A62 // Mn [1]
            || (code >= 0x1A65 && code <= 0x1A6C) // Mn [8]
            || (code >= 0x1A73 && code <= 0x1A7C) // Mn [10]
            || code === 0x1A7F // Mn [1]
        )) ? 0 : 1;
    }
    // Combining Diacritical Marks Extended ... Greek Extended (1AB0 - 1FFF)
    if (code < 0x200B) {
        return (code < 0x1B00 ? (
            // Combining Diacritical Marks Extended
            code <= 0x1ACE // Mn [30] & Me [1]
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
        ) : code < 0x1CD0 ? (
            // Lepcha
            (code >= 0x1C2C && code <= 0x1C33) // Mn [8]
            || (code >= 0x1C36 && code <= 0x1C37) // Mn [2]
        ) : code < 0x1CFA ? (
            // Vedic Extensions
            (code <= 0x1CE0 && code !== 0x1CD3) // Mn [16]
            || (code >= 0x1CE2 && code <= 0x1CE8) // Mn [7]
            || code === 0x1CED // Mn [1]
            || code === 0x1CF4 // Mn [1]
            || code >= 0x1CF8 // Mn [2]
        ) : (
            // Combining Diacritical Marks Supplement
            code >= 0x1DC0 && code <= 0x1DFF // Mn [64]
        )) ? 0 : 1;
    }
    // General Punctuation ... Cyrillic Extended-A (2000 - 2DFF)
    if (code < 0x2E00) {
        return code < 0x231A ? (
            (code <= 0x20F0 && (
                // General Punctuation
                code <= 0x200F // Cf [5]
                || (code >= 0x202A && code <= 0x202E) // Cf [5]
                || (code >= 0x2060 && code <= 0x206F) // Cf [15] & Cn [1]
                // Combining Diacritical Marks for Symbols
                || code >= 0x20D0 // Mn [26] & Me [7]
            )) ? 0 : 1
        ) : code < 0x2614 ? (
            (code < 0x23F4 ? (
                // Miscellaneous Technical
                code <= 0x231B // W [2]
                || (code >= 0x2329 && code <= 0x232A) // W [2]
                || (code >= 0x23E9 && code <= 0x23EC) // W [4]
                || code === 0x23F0 // W [1]
                || code === 0x23F3 // W [1]
            ) : (
                // Geometric Shapes
                code >= 0x25FD && code <= 0x25FE // W [2]
            )) ? 2 : 1
        ) : code < 0x2700 ? (
            // Miscellaneous Symbols
            (code <= 0x26C5 ? (
                code <= 0x2615 // W [2]
                || (code >= 0x2648 && code <= 0x2653) // W [12]
                || code === 0x267F // W [1]
                || code === 0x2693 // W [1]
                || code === 0x26A1 // W [1]
                || (code >= 0x26AA && code <= 0x26AB) // W [2]
                || (code >= 0x26BD && code <= 0x26BE) // W [2]
                || code >= 0x26C4 // W [2]
            ) : (
                code === 0x26CE // W [1]
                || code === 0x26D4 // W [1]
                || code === 0x26EA // W [1]
                || (code >= 0x26F2 && code <= 0x26F5 && code !== 0x26F4) // W [3]
                || code === 0x26FA // W [1]
                || code === 0x26FD // W [1]
            )) ? 2 : 1
        ) : code < 0x27C0 ? (
            // Dingbats
            (code < 0x2753 ? (
                code === 0x2705 // W [1]
                || (code >= 0x270A && code <= 0x270B) // W [2]
                || code === 0x2728 // W [1]
                || code === 0x274C // W [1]
                || code === 0x274E // W [1]
            ) : (
                (code <= 0x2757 && code !== 0x2756) // W [4]
                || (code >= 0x2795 && code <= 0x2797) // W [3]
                || code === 0x27B0 // W [1]
                || code === 0x27BF // W [1]
            )) ? 2 : 1
        ) : code < 0x2CEF ? (
            (code >= 0x2B1B && (
                // Miscellaneous Symbols and Arrows
                code <= 0x2B1C // W [2]
                || code === 0x2B50 // W [1]
                || code === 0x2B55 // W [1]
            )) ? 2 : 1
        ) : (
            // Coptic
            code <= 0x2CF1 // Mn [3]
            // Tifinagh
            || code === 0x2D7F // Mn [1]
            // Cyrillic Extended-A
            || code >= 0x2DE0 // Mn [32]
        ) ? 0 : 1;
    }
    // Supplemental Punctuation ... Hangul Jamo Extended-A (2E00 - A97F)
    if (code < 0xA980) {
        return code < 0x3000 ? (
            (code >= 0x2E80 && (
                // CJK Radicals Supplement
                (code <= 0x2EF3 && code !== 0x2E9A) // W [115]
                // Kangxi Radicals
                || (code >= 0x2F00 && code <= 0x2FD5) // W [214]
                // Ideographic Description Characters
                || (code >= 0x2FF0 && code <= 0x2FFB) // W [12]
            )) ? 2 : 1
        ) : code < 0x3100 ? (
            code <= 0x303E
                // CJK Symbols and Punctuation
                ? ((code >= 0x302A && code <= 0x302D) ? 0 : 2) // Mn [4] / F [1] & W [58]
                // Hiragana & Katakana
                : ((code >= 0x3041 && code <= 0x3096) || code >= 0x309B) ? 2 // W [187]
                    : (code >= 0x3099) ? 0 : 1 // Mn [2]
        ) : code < 0xA66F ? (
            code <= 0x31E3 ? (
                // Bopomofo ... CJK Strokes
                code === 0x3164 ? 0 // Lo [1]
                    : (code >= 0x3105 && code !== 0x3130 && code !== 0x318F) ? 2 : 1 // W [220]
            ) : (code < 0x4DC0 ? (code >= 0x31F0 && (
                // Katakana Phonetic Extensions & Enclosed CJK Letters and Months
                (code <= 0x3247 && code !== 0x321F) // W [87]
                // CJK Compatibility & CJK Unified Ideographs Extension A
                || code >= 0x3250 // W [7,024]
            )) : (code >= 0x4E00 && (
                // CJK Unified Ideographs & Yi Syllables
                code <= 0xA48C // W [22,157]
                // Yi Radicals
                || (code <= 0xA4C6 && code >= 0xA490) // W [55]
            ))) ? 2 : 1
        ) : code < 0xA8C4 ? (
            (code < 0xA800 ? (
                // Cyrillic Extended-B
                (code <= 0xA67D && code !== 0xA673) // Mn [11] & Me [3]
                || (code >= 0xA69E && code <= 0xA69F) // Mn [2]
                // Bamum
                || (code >= 0xA6F0 && code <= 0xA6F1) // Mn [2]
            ) : (
                // Syloti Nagri
                code === 0xA802 // Mn [1]
                || code === 0xA806 // Mn [1]
                || code === 0xA80B // Mn [1]
                || (code >= 0xA825 && code <= 0xA826) // Mn [2]
                || code === 0xA82C // Mn [1]
            )) ? 0 : 1
        ) : (code <= 0xA951 ? ((
            // Saurashtra
            code <= 0xA8C5 // Mn [2]
            // Devanagari Extended
            || (code >= 0xA8E0 && code <= 0xA8F1) // Mn [18]
            || code === 0xA8FF // Mn [1]
            // Kayah Li
            || (code >= 0xA926 && code <= 0xA92D) // Mn [8]
            // Rejang
            || code >= 0xA947 // Mn [11]
        ) ? 0 : 1) : (
            // Hangul Jamo Extended-A
            code >= 0xA960 && code <= 0xA97C // W [29]
        ) ? 2 : 1);
    }
    // Javanese ... Specials (A980 - FFFF)
    if (code < 0x10000) {
        return code < 0xAC00 ? (
            (code < 0xAA29 ? (
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
            ) : (
                // Meetei Mayek
                code === 0xABE5 // Mn [1]
                || code === 0xABE8 // Mn [1]
                || code === 0xABED // Mn [1]
            )) ? 0 : 1
        ) : code < 0xFE00 ? (
            code <= 0xFAD9 ? ((
                // Hangul Syllables
                code <= 0xD7A3 // W [11,172]
                // CJK Compatibility Ideographs
                || (code >= 0xF900 && code <= 0xFA6D) // W [366]
                || code >= 0xFA70 // W [106]
            ) ? 2 : 1) : code === 0xFB1E ? 0 : 1 // Mn [1]
        ) : code < 0xFE6C ? (
            code < 0xFE30 ? (
                // Variation Selectors, Vertical Forms, Combining Half Marks
                (code <= 0xFE0F || code >= 0xFE20) ? 0 // Mn [32]
                    : code <= 0xFE19 ? 2 : 1 // W [10]
            ) : (
                // CJK Compatibility Forms, Small Form Variants
                (code <= 0xFE66 && code !== 0xFE53) // W [54]
                || code >= 0xFE68 // W [4]
            ) ? 2 : 1
        ) : (code < 0xFF01 ? (
            // Arabic Presentation Forms-B
            code === 0xFEFF ? 0 : 1 // Cf [1]
        ) : code <= 0xFFE6 ? (
            // Halfwidth and Fullwidth Forms
            (code <= 0xFF60 || code >= 0xFFE0) ? 2 // F [103]
                : code === 0xFFA0 ? 0 : 1 // Lo [1]
        ) : (
            // Specials
            code >= 0xFFF0 && code <= 0xFFF8 // Cn [9]
        ) ? 0 : 1);
    }
    // Linear B Syllabary ... Khudawadi (10000 - 112FF)
    if (code < 0x11300) {
        return (code < 0x10A01 ? (
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
            // Arabic Extended-C
            || (code >= 0x10EFD && code <= 0x10EFF) // Mn [3]
            // Sogdian
            || code >= 0x10F46 // Mn [11]
        ) : code < 0x1107F ? (
            // Old Uyghur
            (code >= 0x10F82 && code <= 0x10F85) // Mn [4]
            // Brahmi
            || code === 0x11001 // Mn [1]
            || (code >= 0x11038 && code <= 0x11046) // Mn [15]
            || code === 0x11070 // Mn [1]
            || (code >= 0x11073 && code <= 0x11074) // Mn [2]
        ) : code < 0x11100 ? (
            // Kaithi
            code <= 0x11081 // Mn [3]
            || (code >= 0x110B3 && code <= 0x110B6) // Mn [4]
            || (code >= 0x110B9 && code <= 0x110BA) // Mn [2]
            || code === 0x110C2 // Mn [1]
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
            || code === 0x11241 // Mn [1]
        ) : (
            // Khudawadi
            code === 0x112DF // Mn [1]
            || (code >= 0x112E3 && code <= 0x112EA) // Mn [8]
        )) ? 0 : 1;
    }
    // Grantha ... Mro (11300 - 16A6F)
    if (code < 0x16AD0) {
        return (code < 0x11375 ? (
            // Grantha
            code <= 0x11301 // Mn [2]
            || (code >= 0x1133B && code <= 0x1133C) // Mn [2]
            || code === 0x11340 // Mn [1]
            || (code >= 0x11366 && code <= 0x1136C) // Mn [7]
            || code >= 0x11370 // Mn [5]
        ) : code < 0x114C4 ? (
            code <= 0x1145E ? (code >= 0x11438 && (
                // Newa
                code <= 0x1143F // Mn [8]
                || (code >= 0x11442 && code <= 0x11446 && code !== 0x11445) // Mn [4]
                || code === 0x1145E // Mn [1]
            )) : (code >= 0x114B3 && (
                // Tirhuta
                (code <= 0x114BA && code !== 0x114B9) // Mn [7]
                || (code >= 0x114BF && code !== 0x114C1) // Mn [4]
            ))
        ) : code < 0x11641 ? (
            code < 0x115DE ? (code >= 0x115B2 && (
                // Siddham
                code <= 0x115B5 // Mn [4]
                || (code >= 0x115BC && code <= 0x115C0 && code !== 0x115BE) // Mn [4]
                || code >= 0x115DC // Mn [2]
            )) : (code >= 0x11633 && (
                // Modi
                code <= 0x1163A // Mn [8]
                || (code >= 0x1163D && code !== 0x1163E) // Mn [3]
            ))
        ) : code < 0x1172C ? (
            code < 0x116B8 ? (code >= 0x116AB && (
                // Takri
                (code <= 0x116AD && code !== 0x116AC) // Mn [2]
                || (code >= 0x116B0 && code !== 0x116B6) // Mn [7]
            )) : (code >= 0x1171D && (
                // Ahom
                code <= 0x1171F // Mn [3]
                || (code >= 0x11722 && code !== 0x11726) // Mn [9]
            ))
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
        ) : code < 0x11C92 ? (
            code <= 0x11A99 ? (
                // Soyombo
                code <= 0x11A56 // Mn [6]
                || (code >= 0x11A59 && code <= 0x11A5B) // Mn [3]
                || (code >= 0x11A8A && code !== 0x11A97) // Mn [15]
            ) : (code >= 0x11C30 && code <= 0x11C3F && (
                // Bhaiksuki
                code !== 0x11C37 && code !== 0x11C3E // Mn [14]
            ))
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
        ) : code < 0x11F00 ? ((code <= 0x11EF4 && code >= 0x11D90 && (
            // Gunjala Gondi
            code <= 0x11D91 // Mn [2]
            || code === 0x11D95 // Mn [1]
            || code === 0x11D97 // Mn [1]
            // Makasar
            || code >= 0x11EF3 // Mn [2]
        ))) : (code <= 0x11F42 ? (
            // Kawi
            code <= 0x11F01 // Mn [2]
            || (code >= 0x11F36 && code <= 0x11F3A) //  Mn [5]
            || code === 0x11F40 // Mn [1]
            || code === 0x11F42 // Mn [1]
        ) : (
            // Egyptian Hieroglyph Format Controls
            code === 0x13440 // Mn [1]
            || (code >= 0x13447 && code <= 0x13455) // Mn [15]
        ))) ? 0 : 1;
    }
    // Bassa Vah ... Arabic Mathematical Alphabetic Symbols (16AD0 - 1EEFF)
    if (code < 0x1F000) {
        return code < 0x17000 ? (
            code < 0x16F93 ? ((
                // Bassa Vah
                (code >= 0x16AF0 && code <= 0x16AF4) // Mn [5]
                // Pahawh Hmong
                || (code >= 0x16B30 && code <= 0x16B36) // Mn [7]
                // Miao
                || code === 0x16F4F // Mn [1]
                || code >= 0x16F8F // Mn [4]
            ) ? 0 : 1) : ((code >= 0x16FE0 && code <= 0x16FF1) ? (
                // Ideographic Symbols and Punctuation
                (code <= 0x16FE3 || code >= 0x16FF0) ? 2 // W [6]
                    : code === 0x16FE4 ? 0 : 1 // Mn [1]
            ) : 1)
        ) : code < 0x1B2FC ? (
            (code <= 0x18D08 ? (
                // Tangut
                code <= 0x187F7 // W [6,136]
                // Tangut Components, Khitan Small Script
                || (code >= 0x18800 && code <= 0x18CD5) // W [1,238]
                // Tangut Supplement
                || (code >= 0x18D00) // W [9]
            ) : code <= 0x1B122 ? (
                // Kana Extended-B, Kana Supplement, Kana Extended-A
                code >= 0x1AFF0 && code !== 0x1AFF4 && code !== 0x1AFFC && code !== 0x1AFFF // W [304]
            ) : (
                // Small Kana Extension
                code === 0x1B132 // W [1]
                || (code >= 0x1B150 && code <= 0x1B152) // W [3]
                || code === 0x1B155 // W [1]
                || (code >= 0x1B164 && code <= 0x1B167) // W [4]
                // Nushu
                || code >= 0x1B170 // W [396]
            )) ? 2 : 1
        ) : (code < 0x1D167 ? (
            // Duployan, Shorthand Format Controls
            (code >= 0x1BC9D && code <= 0x1BCA3 && code !== 0x1BC9F) // Mn [2] & Cf [4]
            // Znamenny Musical Notation
            || (code >= 0x1CF00 && code <= 0x1CF2D) // Mn [46]
            || (code >= 0x1CF30 && code <= 0x1CF46) // Mn [23]
        ) : code < 0x1D245 ? (
            // Musical Symbols
            code <= 0x1D169 // Mn [3]
            || (code >= 0x1D173 && code <= 0x1D182) // Cf [8] & Mn [8]
            || (code >= 0x1D185 && code <= 0x1D18B) // Mn [7]
            || (code >= 0x1D1AA && code <= 0x1D1AD) // Mn [4]
            // Ancient Greek Musical Notation
            || code >= 0x1D242 // Mn [3]
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
        ) : (code <= 0x1E94A && (
            // Cyrillic Extended-D
            code === 0x1E08F // Mn [1]
            // Nyiakeng Puachue Hmong
            || (code >= 0x1E130 && code <= 0x1E136) // Mn [7]
            // Toto
            || code === 0x1E2AE // Mn [1]
            // Wancho
            || (code >= 0x1E2EC && code <= 0x1E2EF) // Mn [4]
            // Nag Mundari
            || (code >= 0x1E4EC && code <= 0x1E4EF) // Mn [4]
            // Mende Kikakui
            || (code >= 0x1E8D0 && code <= 0x1E8D6) // Mn [7]
            // Adlam
            || code >= 0x1E944 // Mn [7]
        ))) ? 0 : 1;
    }
    // Mahjong Tiles ... CJK Unified Ideographs Extension H (1F000 - 323AF)
    if (code <= 0x323AF) {
        return (code < 0x1F200 ? (
            // Mahjong Tiles
            code === 0x1F004 // W [1]
            // Playing Cards
            || code === 0x1F0CF // W [1]
            // Enclosed Alphanumeric Supplement
            || code === 0x1F18E // W [1]
            || (code >= 0x1F191 && code <= 0x1F19A) // W [10]
        ) : code < 0x1F300 ? (
            // Enclosed Ideographic Supplement
            code <= 0x1F202 // W [3]
            || (code >= 0x1F210 && code <= 0x1F23B) // W [44]
            || (code >= 0x1F240 && code <= 0x1F248) // W [9]
            || (code >= 0x1F250 && code <= 0x1F251) // W [2]
            || (code >= 0x1F260 && code <= 0x1F265) // W [6]
        ) : code < 0x1F650 ? (
            // Miscellaneous Symbols and Pictographs
            code < 0x1F3F8 ? (
                code <= 0x1F320 // W [33]
                || (code >= 0x1F32D && code <= 0x1F393 && code !== 0x1F336 && code !== 0x1F37D) // W [101]
                || (code >= 0x1F3A0 && code <= 0x1F3CA) // W [43]
                || (code >= 0x1F3CF && code <= 0x1F3D3) // W [5]
                || (code >= 0x1F3E0 && code <= 0x1F3F0) // W [17]
                || code === 0x1F3F4 // W [1]
            ) : (
                (code <= 0x1F4FC && code !== 0x1F43F && code !== 0x1F441) // W [259]
                || (code >= 0x1F4FF && code <= 0x1F53D) // W [63]
                || (code >= 0x1F54B && code <= 0x1F567 && code !== 0x1F54F) // W [28]
                || code === 0x1F57A // W [1]
                || (code >= 0x1F595 && code <= 0x1F596) // W [2]
                || code === 0x1F5A4 // W [1]
                // Emoticons
                || code >= 0x1F5FB // W [85]
            )
        ) : code < 0x1F6FD ? (
            // Transport and Map Symbols
            code >= 0x1F680 && (
                code <= 0x1F6C5 // W [70]
                || code === 0x1F6CC // W [1]
                || (code >= 0x1F6D0 && code <= 0x1F6D2) // W [3]
                || (code >= 0x1F6D5 && code <= 0x1F6D7) // W [3]
                || (code >= 0x1F6DC && code <= 0x1F6DF) // W [4]
                || (code >= 0x1F6EB && code <= 0x1F6EC) // W [2]
                || code >= 0x1F6F4 // W [9]
            )
        ) : code < 0x1FA00 ? (
            // Geometric Shapes Extended
            (code >= 0x1F7E0 && code <= 0x1F7EB) // W [12]
            || (code === 0x1F7F0) // W [1]
            // Supplemental Symbols and Pictographs
            || (code >= 0x1F90C && code !== 0x1F93B && code !== 0x1F946) // W [242]
        ) : code <= 0x1FAF8 ? (
            // Symbols and Pictographs Extended-A
            code >= 0x1FA70 && (code <= 0x1FAC5 ? (
                code <= 0x1FA7C // W [13]
                || (code >= 0x1FA80 && code <= 0x1FA88) // W [9]
                || (code >= 0x1FA90 && code !== 0x1FABE) // W [53]
            ) : (
                (code >= 0x1FACE && code <= 0x1FADB) // W [14]
                || (code >= 0x1FAE0 && code <= 0x1FAE8) // W [9]
                || code >= 0x1FAF0 // W [9]
            ))
        ) : (code >= 0x20000 && (code <= 0x2CEA1 ? (
            // CJK Unified Ideographs Extension B
            code <= 0x2A6DF // W [42,720]
            // CJK Unified Ideographs Extension C
            || (code >= 0x2A700 && code <= 0x2B739) // W [4,154]
            // CJK Unified Ideographs Extension D
            || (code >= 0x2B740 && code <= 0x2B81D) // W [222]
            // CJK Unified Ideographs Extension E
            || code >= 0x2B820 // W [5,762]
        ) : (
            // CJK Unified Ideographs Extension F
            (code >= 0x2CEB0 && code <= 0x2EBE0) // W [7,473]
            // CJK Compatibility Ideographs Supplement
            || (code >= 0x2F800 && code <= 0x2FA1D) // W [542]
            // CJK Unified Ideographs Extension G
            || (code >= 0x30000 && code <= 0x3134A) // W [4,939]
            // CJK Unified Ideographs Extension H
            || code >= 0x31350 // W [4,192]
        )))) ? 2 : 1;
    }
    // Tags, Variation Selectors Supplement (E0000 - E01EF)
    return (code >= 0xE0000 && code <= 0xE0FFF) ? 0 : 1; // Cn [3,759] & Cf [97] & Mn [240]
}

module.exports = codePointWidth;