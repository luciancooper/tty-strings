const CR = 1,
    LF = 2,
    Control = 3,
    Extend = 4,
    ZWJ = 5,
    RI = 6,
    Prepend = 7,
    SpacingMark = 8,
    L = 9,
    V = 10,
    T = 11,
    LV = 12,
    LVT = 13,
    ExtendedPictographic = 14;

/**
 * Returns the grapheme cluster break property of a given Unicode code point
 * Properties are derived from {@link https://unicode.org/Public/13.0.0/ucd/auxiliary/GraphemeBreakProperty.txt}
 * Extended_Pictographic values are derived from {@link https://unicode.org/Public/13.0.0/ucd/emoji/emoji-data.txt}
 * @param {number} code - unicode code point
 * @returns {number}
 */
function graphemeBreakProperty(code) {
    // Basic Latin (0000 - 007F)
    if (code < 0x7F) {
        return code > 0x1F ? 0
            // Carriage return (CR)
            : code === 0x0D ? CR
                // Line feed (LF)
                : code === 0x0A ? LF
                    : Control; // [30]
    }
    // Latin-1 Supplement ... Combining Diacritical Marks (0080 - 036F)
    if (code < 0x0370) {
        return code <= 0xAE ? (
            // Latin-1 Supplement
            (code <= 0x9F || code === 0xAD) ? Control // [34]
                : (code === 0xA9 || code === 0xAE) ? ExtendedPictographic : 0
        ) : code >= 0x0300 ? Extend : 0; // Combining Diacritical Marks [112]
    }
    // Greek and Coptic ... Georgian (0370 - 10FF)
    if (code < 0x1100) {
        return code < 0x0600 ? (
            (code < 0x0591 ? (
                // Cyrillic
                code >= 0x0483 && code <= 0x0489 // [7]
            ) : (
                // Hebrew
                code <= 0x05BD // [45]
                || (code >= 0x05BF && code <= 0x05C2 && code !== 0x05C0) // [3]
                || (code >= 0x05C4 && code <= 0x05C7 && code !== 0x05C6) // [3]
            )) ? Extend : 0
        ) : code < 0x0700 ? (
            // Arabic
            code < 0x06D6 ? (
                code <= 0x0605 ? Prepend // [6]
                    : code === 0x061C ? Control : (
                        (code >= 0x0610 && code <= 0x061A) // [11]
                        || (code >= 0x064B && code <= 0x065F) // [21]
                        || code === 0x0670 // [1]
                    ) ? Extend : 0
            ) : (code === 0x06DD) ? Prepend : (
                (code <= 0x06E4 && code !== 0x06DE) // [13]
                || (code >= 0x06E7 && code <= 0x06ED && code !== 0x06E9) // [6]
            ) ? Extend : 0
        ) : code < 0x0800 ? (
            code <= 0x074A ? (
                // Syriac
                (code >= 0x0730 || code === 0x0711) ? Extend // [28]
                    : (code === 0x070F) ? Prepend : 0 // [1]
            ) : (
                // Thaana
                (code >= 0x07A6 && code <= 0x07B0) // [11]
                // Nko
                || (code >= 0x07EB && code <= 0x07F3) // [9]
                || code === 0x07FD // [1]
            ) ? Extend : 0
        ) : code < 0x0903 ? (
            code <= 0x085B ? ((
                // Samaritan
                (code >= 0x0816 && code <= 0x0823 && code !== 0x081A) // [13]
                || (code >= 0x0825 && code <= 0x082D && code !== 0x0828) // [8]
                // Mandaic
                || code >= 0x0859 // [3]
            ) ? Extend : 0) : code >= 0x08D3 ? (
                // Arabic Extended-A
                (code === 0x08E2) ? Prepend : Extend // [1 / 47]
            ) : 0
        ) : code < 0x0981 ? (
            // Devanagari
            code < 0x093E ? (
                (code === 0x0903 || code === 0x093B) ? SpacingMark // [2]
                    : (code >= 0x093A && code <= 0x093C) ? Extend : 0 // [2]
            ) : code <= 0x094F ? (
                ((code >= 0x0941 && code <= 0x0948) || code === 0x094D) ? Extend : SpacingMark // [9 / 9]
            ) : (
                (code >= 0x0951 && code <= 0x0957) // [7]
                || (code >= 0x0962 && code <= 0x0963) // [2]
            ) ? Extend : 0
        ) : code < 0x0A01 ? (
            // Bengali
            code <= 0x09C4 ? (
                code < 0x09BE ? (
                    (code === 0x0981 || code === 0x09BC) ? Extend // [2]
                        : code <= 0x0983 ? SpacingMark : 0 // [2]
                ) : (code >= 0x09BF && code <= 0x09C0) ? SpacingMark : Extend // [2 / 5]
            ) : code <= 0x09CC ? ((
                (code >= 0x09C7 && code <= 0x09C8) // [2]
                || code >= 0x09CB // [2]
            ) ? SpacingMark : 0) : (
                code === 0x09CD // [1]
                || code === 0x09D7 // [1]
                || (code >= 0x09E2 && code <= 0x09E3) // [2]
                || code === 0x09FE // [1]
            ) ? Extend : 0
        ) : code < 0x0A81 ? (
            // Gurmukhi
            code <= 0x0A40 ? (
                (code === 0x0A03 || code >= 0x0A3E) ? SpacingMark // [4]
                    : (code <= 0x0A02 || code === 0x0A3C) ? Extend : 0 // [3]
            ) : (code <= 0x0A4D ? (
                code <= 0x0A42 // [2]
                || (code >= 0x0A47 && code <= 0x0A48) // [2]
                || code >= 0x0A4B // [3]
            ) : (
                code === 0x0A51 // [1]
                || (code >= 0x0A70 && code <= 0x0A71) // [2]
                || code === 0x0A75 // [1]
            )) ? Extend : 0
        ) : code < 0x0B00 ? (
            // Gujarati
            code < 0x0AC1 ? (
                (code <= 0x0A82 || code === 0x0ABC) ? Extend // [3]
                    : (code === 0x0A83 || code >= 0x0ABE) ? SpacingMark : 0 // [4]
            ) : code <= 0x0ACC ? (
                code <= 0x0AC8 ? (code !== 0x0AC6 ? Extend : 0) // [7]
                    : (code !== 0x0ACA) ? SpacingMark : 0 // [3]
            ) : (
                code === 0x0ACD // [1]
                || (code >= 0x0AE2 && code <= 0x0AE3) // [2]
                || (code >= 0x0AFA) // [6]
            ) ? Extend : 0
        ) : code < 0x0B80 ? (
            // Oriya
            code <= 0x0B44 ? (
                ((code >= 0x0B02 && code <= 0x0B03) || code === 0x0B40) ? SpacingMark // [3]
                    : (code === 0x0B01 || code === 0x0B3C || code >= 0x0B3E) ? Extend : 0 // [8]
            ) : code <= 0x0B4C ? (
                ((code >= 0x0B47 && code <= 0x0B48) || code >= 0x0B4B) ? SpacingMark : 0 // [4]
            ) : (
                code === 0x0B4D // [1]
                || (code >= 0x0B55 && code <= 0x0B57) // [3]
                || (code >= 0x0B62 && code <= 0x0B63) // [2]
            ) ? Extend : 0
        ) : code < 0x0C00 ? (
            // Tamil
            code < 0x0BC1 ? (
                (code === 0x0BBF) ? SpacingMark // [1]
                    : (code === 0x0B82 || code >= 0x0BBE) ? Extend : 0 // [3]
            ) : code <= 0x0BCC ? ((
                code <= 0x0BC2 // [2]
                || (code >= 0x0BC6 && code <= 0x0BC8) // [3]
                || code >= 0x0BCA // [3]
            ) ? SpacingMark : 0) : (
                code === 0x0BCD // [1]
                || code === 0x0BD7 // [1]
            ) ? Extend : 0
        ) : code < 0x0C64 ? (
            // Telugu
            code <= 0x0C44 ? ((
                (code >= 0x0C01 && code <= 0x0C03) // [3]
                || code >= 0x0C41 // [4]
            ) ? SpacingMark
                : (code <= 0x0C04 || code >= 0x0C3E) ? Extend : 0 // [5]
            ) : (
                (code >= 0x0C46 && code <= 0x0C4D && code !== 0x0C49) // [7]
                || (code >= 0x0C55 && code <= 0x0C56) // [2]
                || code >= 0x0C62 // [2]
            ) ? Extend : 0
        ) : code < 0x0D00 ? (
            // Kannada
            code <= 0x0CC4 ? (
                code < 0x0CBE ? (
                    (code === 0x0C81 || code === 0x0CBC) ? Extend // [2]
                        : (code >= 0x0C82 && code <= 0x0C83) ? SpacingMark : 0 // [2]
                ) : (code === 0x0CBF || code === 0x0CC2) ? Extend : SpacingMark // [2 / 5]
            ) : code < 0x0CCC ? (
                (code === 0x0CC6) ? Extend // [1]
                    : (code >= 0x0CC7 && code !== 0x0CC9) ? SpacingMark : 0 // [4]
            ) : (
                code <= 0x0CCD // [2]
                || (code >= 0x0CD5 && code <= 0x0CD6) // [2]
                || (code >= 0x0CE2 && code <= 0x0CE3) // [2]
            ) ? Extend : 0
        ) : code < 0x0D64 ? (
            // Malayalam
            code <= 0x0D44 ? (
                code < 0x0D3B ? (
                    code <= 0x0D01 ? Extend // [2]
                        : code <= 0x0D03 ? SpacingMark : 0 // [2]
                ) : (code >= 0x0D3F && code <= 0x0D40) ? SpacingMark // [2]
                    : (code !== 0x0D3D) ? Extend : 0 // [7]
            ) : code <= 0x0D4C ? (
                (code >= 0x0D46 && code !== 0x0D49) ? SpacingMark : 0 // [6]
            ) : (
                code === 0x0D4D // [1]
                || code === 0x0D57 // [1]
                || code >= 0x0D62 // [2]
            ) ? Extend : (code === 0x0D4E) ? Prepend : 0
        ) : code < 0x0DF4 ? (
            // Sinhala
            code <= 0x0DD4 ? ((
                (code >= 0x0D82 && code <= 0x0D83) // [2]
                || (code >= 0x0DD0 && code <= 0x0DD1) // [2]
            ) ? SpacingMark
                : (code === 0x0D81 || code === 0x0DCA || code >= 0x0DCF) ? Extend : 0 // [6]
            ) : (code === 0x0DD6 || code === 0x0DDF) ? Extend // [2]
                : ((code >= 0x0DD8 && code <= 0x0DDE) || code >= 0x0DF2) ? SpacingMark : 0 // [9]
        ) : code < 0x0F18 ? (
            code <= 0x0E4E ? (
                // Thai
                (code >= 0x0E31 && code <= 0x0E3A) ? (
                    (code === 0x0E33) ? SpacingMark // [1]
                        : (code !== 0x0E32) ? Extend : 0 // [8]
                ) : code >= 0x0E47 ? Extend : 0 // [8]
            ) : (
                // Lao
                (code >= 0x0EB1 && code <= 0x0EBC) ? (
                    (code === 0x0EB3) ? SpacingMark // [1]
                        : (code !== 0x0EB2) ? Extend : 0 // [10]
                ) : (code >= 0x0EC8 && code <= 0x0ECD) ? Extend : 0 // [6]
            )
        ) : code < 0x102D ? (
            // Tibetan
            code <= 0x0F39 ? ((
                code <= 0x0F19 // [2]
                || (code >= 0x0F35 && code !== 0x0F36 && code !== 0x0F38) // [3]
            ) ? Extend : 0) : code <= 0x0F84 ? (
                ((code <= 0x0F3F && code >= 0x0F3E) || code === 0x0F7F) ? SpacingMark // [3]
                    : code >= 0x0F71 ? Extend : 0 // [19]
            ) : (code <= 0x0FC6 && (
                (code <= 0x0F87 && code !== 0x0F85) // [2]
                || (code >= 0x0F8D && code <= 0x0FBC && code !== 0x0F98) // [47]
                || code === 0x0FC6 // [1]
            )) ? Extend : 0
        ) : (
            // Myanmar
            code < 0x1056 ? (
                (code === 0x1031 || (code >= 0x103B && code <= 0x103C)) ? SpacingMark // [3]
                    : (code <= 0x103E && code !== 0x1038) ? Extend : 0 // [14]
            ) : code <= 0x1074 ? (
                code <= 0x1057 ? SpacingMark : (
                    code <= 0x1059 // [2]
                    || (code >= 0x105E && code <= 0x1060) // [3]
                    || code >= 0x1071 // [4]
                ) ? Extend : 0
            ) : code === 0x1084 ? SpacingMark : (
                (code >= 0x1082 && code <= 0x1086 && code !== 0x1083) // [3]
                || code === 0x108D // [1]
                || code === 0x109D // [1]
            ) ? Extend : 0
        );
    }
    // Hangul Jamo ... Vedic Extensions (1100 - 1CFF)
    if (code < 0x1D00) {
        return code < 0x1200 ? (
            // Hangul Jamo
            (code < 0x1160) ? L : (code < 0x11A8) ? V : T // L [96] V [72] T [88]
        ) : code < 0x1774 ? (
            (code <= 0x1714 ? (
                // Ethiopic
                (code <= 0x135F && code >= 0x135D) // [3]
                // Tagalog
                || code >= 0x1712 // [3]
            ) : (
                // Hanunoo
                (code >= 0x1732 && code <= 0x1734) // [3]
                // Buhid
                || (code >= 0x1752 && code <= 0x1753) // [2]
                // Tagbanwa
                || code >= 0x1772 // [2]
            )) ? Extend : 0
        ) : code < 0x180B ? (
            // Khmer
            (code >= 0x17B4 && code <= 0x17D3) ? (
                (code === 0x17B6 || (code >= 0x17BE && code <= 0x17C8 && code !== 0x17C6))
                    ? SpacingMark // [11]
                    : Extend // [21]
            ) : code === 0x17DD ? Extend : 0 // [1]
        ) : code < 0x1920 ? (
            // Mongolian
            (code === 0x180E) ? Control : (
                code <= 0x180D // [3]
                || (code >= 0x1885 && code <= 0x1886) // [2]
                || code === 0x18A9 // [1]
            ) ? Extend : 0
        ) : code < 0x1A55 ? (
            code <= 0x193B ? (
                // Limbu
                code <= 0x192B ? (
                    (code <= 0x1922 || (code >= 0x1927 && code <= 0x1928)) ? Extend : SpacingMark // [5 / 7]
                ) : code >= 0x1930 ? (
                    (code === 0x1932 || code >= 0x1939) ? Extend : SpacingMark // [4 / 8]
                ) : 0
            ) : (code >= 0x1A17 && code <= 0x1A1B) ? (
                // Buginese
                (code >= 0x1A19 && code <= 0x1A1A) ? SpacingMark : Extend // [2 / 3]
            ) : 0
        ) : code < 0x1B00 ? (
            // Tai Tham
            code <= 0x1A62 ? (
                (code === 0x1A55 || code === 0x1A57) ? SpacingMark // [2]
                    : (code !== 0x1A5F && code !== 0x1A61) ? Extend : 0 // [10]
            ) : (code >= 0x1A65 && code <= 0x1A7C) ? (
                (code >= 0x1A6D && code <= 0x1A72) ? SpacingMark : Extend // [6 / 18]
            ) : (
                code === 0x1A7F // [1]
                // Combining Diacritical Marks Extended
                || (code >= 0x1AB0 && code <= 0x1AC0) // [17]
            ) ? Extend : 0
        ) : code < 0x1B80 ? (
            // Balinese
            code <= 0x1B3A ? (
                (code <= 0x1B03 || code >= 0x1B34) ? Extend // [11]
                    : (code === 0x1B04) ? SpacingMark : 0 // [1]
            ) : code <= 0x1B44 ? (
                (code === 0x1B3C || code === 0x1B42) ? Extend : SpacingMark // [2 / 8]
            ) : (code >= 0x1B6B && code <= 0x1B73) ? Extend : 0 // [9]
        ) : code < 0x1BE6 ? (
            // Sundanese
            code < 0x1BA2 ? (
                code <= 0x1B81 ? Extend // [2]
                    : (code === 0x1B82 || code === 0x1BA1) ? SpacingMark : 0 // [2]
            ) : code <= 0x1BAD ? (
                ((code >= 0x1BA6 && code <= 0x1BA7) || code === 0x1BAA) ? SpacingMark : Extend // [3 / 9]
            ) : 0
        ) : code < 0x1CD0 ? (
            code <= 0x1BF3 ? ((
                // Batak
                code === 0x1BE7 // [1]
                || (code >= 0x1BEA && code <= 0x1BEC) // [3]
                || code === 0x1BEE // [1]
                || code >= 0x1BF2 // [2]
            ) ? SpacingMark : Extend) : (code >= 0x1C24 && code <= 0x1C37) ? (
                // Lepcha
                (code <= 0x1C2B || (code >= 0x1C34 && code <= 0x1C35)) ? SpacingMark : Extend // [10 / 10]
            ) : 0
        ) : (
            // Vedic Extensions
            (code === 0x1CE1 || code === 0x1CF7) ? SpacingMark : (
                code <= 0x1CD2 // [3]
                || (code >= 0x1CD4 && code <= 0x1CE8) // [20]
                || code === 0x1CED || code === 0x1CF4 // [2]
                || (code >= 0x1CF8 && code <= 0x1CF9) // [2]
            ) ? Extend : 0
        );
    }
    // Phonetic Extensions ... Combining Diacritical Marks for Symbols (1D00 - 20FF)
    if (code < 0x2100) {
        return code < 0x200B ? (
            // Combining Diacritical Marks Supplement
            (code >= 0x1DC0 && code <= 0x1DFF && code !== 0x1DFA) ? Extend : 0 // [63]
        ) : code === 0x200D ? ZWJ : code > 0x206F ? (
            // Combining Diacritical Marks for Symbols
            (code >= 0x20D0 && code <= 0x20F0) ? Extend : 0 // [33]
        ) : code === 0x200C ? Extend : (
            code <= 0x200F // [3]
            || (code >= 0x2028 && code <= 0x202E) // [7]
            || code >= 0x2060 // [16]
        ) ? Control : (code === 0x203C || code === 0x2049) ? ExtendedPictographic : 0;
    }
    // Letterlike Symbols ... Miscellaneous Symbols and Arrows (2100 - 2BFF)
    if (code < 0x2C00) {
        return (code < 0x231A ? (
            code < 0x2194 ? (
                // Letterlike Symbols
                code === 0x2122 // [1]
                || code === 0x2139 // [2]
            ) : (code <= 0x21AA && (
                // Arrows
                code <= 0x2199 // [6]
                || (code >= 0x21A9) // [2]
            ))
        ) : code < 0x23FB ? (
            // Miscellaneous Technical
            code <= 0x231B // [2]
            || code === 0x2328 // [1]
            || code === 0x2388 // [1]
            || code === 0x23CF // [1]
            || (code >= 0x23E9 && code <= 0x23F3) // [11]
            || code >= 0x23F8 // [3]
        ) : code < 0x2600 ? (
            code < 0x25AA ? (
                // Enclosed Alphanumerics
                code === 0x24C2
            ) : (code <= 0x25FE && (
                // Geometric Shapes
                code <= 0x25AB // [2]
                || code === 0x25B6 || code === 0x25C0 // [2]
                || code >= 0x25FB // [4]
            ))
        ) : code < 0x27C0 ? (code <= 0x2716 ? (
            // Miscellaneous Symbols
            (code <= 0x2685 && code !== 0x2606 && code !== 0x2613) // [132]
            // Dingbats
            || (code >= 0x2690 && code <= 0x2705) // [118]
            || (code >= 0x2708 && code !== 0x2713 && code !== 0x2715) // [13]
        ) : code <= 0x2734 ? (
            // Dingbats
            code === 0x271D // [1]
            || code === 0x2721 // [1]
            || code === 0x2728 // [1]
            || code >= 0x2733 // [2]
        ) : code <= 0x2757 ? (
            // Dingbats
            code === 0x2744 // [1]
            || code === 0x2747 // [1]
            || code === 0x274C // [1]
            || code === 0x274E // [1]
            || (code >= 0x2753 && code !== 0x2756) // [4]
        ) : (
            // Dingbats
            (code >= 0x2763 && code <= 0x2767) // [5]
            || (code >= 0x2795 && code <= 0x2797) // [3]
            || code === 0x27A1 // [1]
            || code === 0x27B0 // [1]
            || code === 0x27BF // [1]
        )) : (
            // Supplemental Arrows-B
            (code >= 0x2934 && code <= 0x2935) // [2]
            // Miscellaneous Symbols and Arrows
            || (code >= 0x2B05 && (
                code <= 0x2B07 // [3]
                || (code >= 0x2B1B && code <= 0x2B1C) // [2]
                || code === 0x2B50 // [1]
                || code === 0x2B55 // [1]
            ))
        )) ? ExtendedPictographic : 0;
    }
    // Glagolitic ... Meetei Mayek (2C00 - ABFF)
    if (code < 0xAC00) {
        return code < 0x302A ? (
            (code <= 0x2DFF && code >= 0x2CEF && (
                // Coptic
                code <= 0x2CF1 // [3]
                // Tifinagh
                || code === 0x2D7F // [1]
                // Cyrillic Extended-A
                || code >= 0x2DE0 // [32]
            )) ? Extend : 0
        ) : code < 0x3300 ? (
            code <= 0x309A ? (
                // CJK Symbols and Punctuation + Hiragana
                (code <= 0x302F || code >= 0x3099) ? Extend // [8]
                    : (code === 0x3030 || code === 0x303D) ? ExtendedPictographic : 0 // [2]
            ) : (
                // Enclosed CJK Letters and Months
                code === 0x3297 || code === 0x3299 // [2]
            ) ? ExtendedPictographic : 0
        ) : code < 0xA800 ? (
            (code >= 0xA66F && code <= 0xA6F1 && (
                // Cyrillic Extended-B
                (code <= 0xA67D && code !== 0xA673) // [14]
                || (code <= 0xA69F && code >= 0xA69E) // [2]
                // Bamum
                || code >= 0xA6F0 // [2]
            )) ? Extend : 0
        ) : code < 0xA880 ? (
            // Syloti Nagri
            code < 0xA823 ? ((
                code === 0xA802 // [1]
                || code === 0xA806 // [1]
                || code === 0xA80B // [1]
            ) ? Extend : 0) : code <= 0xA827 ? (
                (code >= 0xA825 && code <= 0xA826) ? Extend : SpacingMark // [2 / 3]
            ) : (code === 0xA82C) ? Extend : 0 // [1]
        ) : code < 0xA900 ? (
            // Saurashtra, Devanagari Extended
            code < 0xA8C4 ? ((
                code <= 0xA881 // [2]
                || code >= 0xA8B4 // [16]
            ) ? SpacingMark : 0) : (
                code <= 0xA8C5 // [2]
                || (code >= 0xA8E0 && code <= 0xA8F1) // [18]
                || code === 0xA8FF // [1]
            ) ? Extend : 0
        ) : code < 0xA980 ? (
            code <= 0xA953 ? (
                // Kayah Li, Rejang
                code >= 0xA952 ? SpacingMark : (
                    (code >= 0xA926 && code <= 0xA92D) // [8]
                    || code >= 0xA947 // [11]
                ) ? Extend : 0
            ) : (
                // Hangul Jamo Extended-A
                code >= 0xA960 && code <= 0xA97C // [29]
            ) ? L : 0
        ) : code < 0xAA00 ? (
            code <= 0xA9C0 ? (
                // Javanese
                code <= 0xA983 ? (
                    code <= 0xA982 ? Extend : SpacingMark // [3 / 1]
                ) : code >= 0xA9B3 ? ((
                    code === 0xA9B3 // [1]
                    || (code >= 0xA9B6 && code <= 0xA9B9) // [4]
                    || (code >= 0xA9BC && code <= 0xA9BD) // [2]
                ) ? Extend : SpacingMark) : 0
            ) : (
                // Myanmar Extended-B
                code === 0xA9E5 // [1]
            ) ? Extend : 0
        ) : code < 0xAA80 ? (
            // Cham, Myanmar Extended-A
            code <= 0xAA36 ? (
                code < 0xAA29 ? 0 : (
                    (code >= 0xAA2F && code <= 0xAA30) // [2]
                    || (code >= 0xAA33 && code <= 0xAA34) // [2]
                ) ? SpacingMark : Extend // [4 / 10]
            ) : (code === 0xAA43 || code === 0xAA4C || code === 0xAA7C) ? Extend // [3]
                : (code === 0xAA4D) ? SpacingMark : 0 // [1]
        ) : code < 0xAB00 ? (
            code < 0xAAEB ? ((
                // Tai Viet
                (code >= 0xAAB0 && code <= 0xAAB4 && code !== 0xAAB1) // [4]
                || (code >= 0xAAB7 && code <= 0xAAB8) // [2]
                || (code >= 0xAABE && code <= 0xAAC1 && code !== 0xAAC0) // [3]
            ) ? Extend : 0) : code <= 0xAAEF ? (
                // Meetei Mayek Extensions
                (code >= 0xAAEC && code <= 0xAAED) ? Extend : SpacingMark // [2 / 3]
            ) : (code === 0xAAF5) ? SpacingMark // [1]
                : (code === 0xAAF6) ? Extend : 0 // [1]
        ) : code >= 0xABE3 ? (
            // Meetei Mayek
            code <= 0xABEA ? (
                (code === 0xABE5 || code === 0xABE8) ? Extend : SpacingMark // [2 / 6]
            ) : (code === 0xABEC) ? SpacingMark // [1]
                : (code === 0xABED) ? Extend : 0 // [1]
        ) : 0;
    }
    // Hangul Syllables ... Specials (AC00 - FFFF)
    if (code < 0x10000) {
        return code <= 0xD7A3 ? (
            // Hangul Syllable
            ((code - 0xAC00) % 28 ? LVT : LV) // [11,172]
        ) : code <= 0xD7FB ? (
            // Hangul Jamo Extended-B
            code >= 0xD7CB ? T // [49]
                : (code >= 0xD7B0 && code <= 0xD7C6) ? V : 0 // [23]
        ) : code <= 0xFE2F ? (
            (code < 0xFE00 ? (
                // Alphabetic Presentation Forms
                code === 0xFB1E
            ) : (
                // Variation Selectors
                code <= 0xFE0F
                // Combining Half Marks
                || code >= 0xFE20
            )) ? Extend : 0
        ) : (
            // Zero Width No-Break Space + Specials
            (code === 0xFEFF || (code >= 0xFFF0 && code <= 0xFFFB)) ? Control // [1]
                // Halfwidth and Fullwidth Forms
                : (code >= 0xFF9E && code <= 0xFF9F) ? Extend : 0 // [2]
        );
    }
    // Linear B Syllabary .. Newa (10000 - 1147F)
    if (code < 0x11480) {
        return code < 0x11000 ? (
            (code < 0x10A01 ? (code <= 0x1037A && (
                // Phaistos Disc
                code === 0x101FD // [1]
                // Coptic Epact Numbers
                || code === 0x102E0 // [1]
                // Old Permic
                || code >= 0x10376 // [5]
            )) : code < 0x10AE5 ? (
                // Kharoshthi
                (code <= 0x10A06 && code !== 0x10A04) // [5]
                || (code >= 0x10A0C && code <= 0x10A0F) // [4]
                || (code >= 0x10A38 && code <= 0x10A3A) // [3]
                || code === 0x10A3F // [1]
            ) : (
                // Manichaean
                code <= 0x10AE6 // [2]
                // Hanifi Rohingya
                || (code >= 0x10D24 && code <= 0x10D27) // [4]
                // Yezidi
                || (code >= 0x10EAB && code <= 0x10EAC) // [2]
                // Sogdian
                || (code >= 0x10F46 && code <= 0x10F50) // [11]
            )) ? Extend : 0
        ) : code < 0x11082 ? (
            // Brahmi
            code <= 0x11002 ? (
                code === 0x11001 ? Extend : SpacingMark // [1 / 2]
            ) : (
                (code >= 0x11038 && code <= 0x11046) // [15]
                || code >= 0x1107F // [3]
            ) ? Extend : 0
        ) : code < 0x11100 ? (
            // Kaithi
            code <= 0x110BA ? (
                code < 0x110B0 ? (code === 0x11082 ? SpacingMark : 0) : (
                    code <= 0x110B2 || (code >= 0x110B7 && code <= 0x110B8)
                ) ? SpacingMark : Extend // [5 / 6]
            ) : (code === 0x110BD || code === 0x110CD) ? Prepend : 0 // [2]
        ) : code < 0x11180 ? (
            // Chakma
            code <= 0x11134 ? (
                code === 0x1112C ? SpacingMark // [1]
                    : (code <= 0x11102 || code >= 0x11127) ? Extend : 0 // [16]
            ) : (code >= 0x11145 && code <= 0x11146) ? SpacingMark // [2]
                // Mahajani
                : code === 0x11173 ? Extend : 0 // [1]
        ) : code < 0x1122C ? (
            // Sharada
            code <= 0x111C0 ? (
                (code <= 0x11181 || (code >= 0x111B6 && code <= 0x111BE)) ? Extend // [11]
                    : (code === 0x11182 || code >= 0x111B3) ? SpacingMark : 0 // [6]
            ) : code <= 0x111CF ? (
                ((code >= 0x111C9 && code <= 0x111CC) || code === 0x111CF) ? Extend // [5]
                    : (code >= 0x111C2 && code <= 0x111C3) ? Prepend // [2]
                        : code === 0x111CE ? SpacingMark : 0 // [1]
            ) : 0
        ) : code < 0x11300 ? (
            code <= 0x1123E ? (
                // Khojki
                code > 0x11237 ? (
                    code === 0x1123E ? Extend : 0 // [1]
                ) : (
                    code <= 0x1122E // [3]
                    || (code >= 0x11232 && code <= 0x11233) // [2]
                    || code === 0x11235 // [1]
                ) ? SpacingMark : Extend // [6 / 6]
            ) : (code >= 0x112DF && code <= 0x112EA) ? (
                // Khudawadi
                (code >= 0x112E0 && code <= 0x112E2) ? SpacingMark : Extend // [3 / 9]
            ) : 0
        ) : code < 0x11375 ? (
            // Grantha
            code <= 0x1133E ? (
                (code <= 0x11301 || (code >= 0x1133B && code !== 0x1133D)) ? Extend // [5]
                    : code <= 0x11303 ? SpacingMark : 0 // [2]
            ) : code <= 0x1134D ? (
                code === 0x11340 ? Extend : (
                    code <= 0x11344 // [5]
                    || (code >= 0x11347 && code <= 0x11348) // [2]
                    || code >= 0x1134B // [3]
                ) ? SpacingMark : 0
            ) : (code >= 0x11362 && code <= 0x11363) ? SpacingMark : (
                code === 0x11357 // [1]
                || (code >= 0x11366 && code <= 0x1136C) // [7]
                || code >= 0x11370 // [5]
            ) ? Extend : 0
        ) : (
            // Newa
            code > 0x11446 ? (
                code === 0x1145E ? Extend : 0
            ) : code >= 0x11435 ? ((
                code <= 0x11437 // [3]
                || (code >= 0x11440 && code <= 0x11441) // [2]
                || code === 0x11445 // [1]
            ) ? SpacingMark : Extend) : 0
        );
    }
    // Tirhuta ... Pau Cin Hau (11480 - 11AFF)
    if (code < 0x11C00) {
        return code < 0x115AF ? (
            // Tirhuta
            (code >= 0x114B0 && code <= 0x114C3) ? ((
                (code >= 0x114B1 && code <= 0x114B2) // [2]
                || code === 0x114B9 // [1]
                || (code >= 0x114BB && code <= 0x114BC) // [2]
                || code === 0x114BE // [1]
                || code === 0x114C1 // [1]
            ) ? SpacingMark : Extend) : 0
        ) : code < 0x11630 ? (
            // Siddham
            code <= 0x115BB ? (
                ((code >= 0x115B0 && code <= 0x115B1) || code >= 0x115B8) ? SpacingMark // [6]
                    : code <= 0x115B5 ? Extend : 0 // [5]
            ) : code <= 0x115C0 ? (
                code === 0x115BE ? SpacingMark : Extend // [1 / 4]
            ) : (code >= 0x115DC && code <= 0x115DD) ? Extend : 0 // [2]
        ) : code < 0x116AB ? (
            // Modi
            code <= 0x11640 ? ((
                code <= 0x11632 // [3]
                || (code >= 0x1163B && code <= 0x1163C) // [2]
                || code === 0x1163E // [1]
            ) ? SpacingMark : Extend) : 0
        ) : code < 0x1171D ? (
            // Takri
            code <= 0x116B7 ? ((
                code === 0x116AC // [1]
                || (code >= 0x116AE && code <= 0x116AF) // [2]
                || code === 0x116B6 // [1]
            ) ? SpacingMark : Extend) : 0
        ) : code < 0x11930 ? (
            code <= 0x1172B ? (
                // Ahom
                ((code >= 0x11720 && code <= 0x11721) || code === 0x11726) ? SpacingMark : Extend // [3 / 12]
            ) : (code >= 0x1182C && code <= 0x1183A) ? (
                // Dogra
                (code <= 0x1182E || code === 0x11838) ? SpacingMark : Extend // [4 / 11]
            ) : 0
        ) : code < 0x119D1 ? (
            // Dives Akuru
            code < 0x1193B ? (
                (code === 0x11930) ? Extend // [1]
                    : (code <= 0x11938 && code !== 0x11936) ? SpacingMark : 0 // [7]
            ) : code <= 0x11943 ? (
                (code <= 0x1193C || code === 0x1193E || code === 0x11943) ? Extend // [4]
                    : (code === 0x1193F || code === 0x11941) ? Prepend : SpacingMark // [2 / 3]
            ) : 0
        ) : code < 0x11A01 ? (
            // Nandinagari
            code <= 0x119D7 ? (
                code <= 0x119D3 ? SpacingMark : Extend // [3 / 4]
            ) : (code >= 0x119DA && code <= 0x119E0) ? (
                (code >= 0x119DC && code <= 0x119DF) ? SpacingMark : Extend // [4 / 3]
            ) : (code === 0x119E4) ? SpacingMark : 0 // [1]
        ) : code < 0x11A51 ? (
            // Zanabazar Square
            code < 0x11A33 ? (
                code <= 0x11A0A ? Extend : 0 // [10]
            ) : code <= 0x11A3E ? (
                code === 0x11A39 ? SpacingMark // [1]
                    : code === 0x11A3A ? Prepend : Extend // [1 / 10]
            ) : (code === 0x11A47) ? Extend : 0 // [1]
        ) : (
            // Soyombo
            code <= 0x11A5B ? (
                (code >= 0x11A57 && code <= 0x11A58) ? SpacingMark : Extend // [2 / 9]
            ) : (code >= 0x11A84 && code <= 0x11A99) ? (
                code <= 0x11A89 ? Prepend // [6]
                    : code === 0x11A97 ? SpacingMark : Extend // [1 / 15]
            ) : 0
        );
    }
    // Bhaiksuki ... Arabic Mathematical Alphabetic Symbols (11C00 - 1EEFF)
    if (code < 0x1F000) {
        return code < 0x11D31 ? (
            code <= 0x11C3F ? (code >= 0x11C2F ? (
                // Bhaiksuki
                (code === 0x11C2F || code === 0x11C3E) ? SpacingMark // [2]
                    : code !== 0x11C37 ? Extend : 0 // [14]
            ) : 0) : (code >= 0x11C92 && code <= 0x11CB6) ? (
                // Marchen
                (code === 0x11CA9 || code === 0x11CB1 || code === 0x11CB4) ? SpacingMark // [3]
                    : code !== 0x11CA8 ? Extend : 0
            ) : 0
        ) : code < 0x11D8A ? (
            // Masaram Gondi
            code <= 0x11D47 ? (
                code === 0x11D46 ? Prepend : (
                    code <= 0x11D36 // [6]
                    || (code >= 0x11D3A && code !== 0x11D3B && code !== 0x11D3E) // [11]
                ) ? Extend : 0
            ) : 0
        ) : code < 0x11EF3 ? (
            // Gunjala Gondi
            code <= 0x11D94 ? (
                (code <= 0x11D8E || code >= 0x11D93) ? SpacingMark // [7]
                    : (code >= 0x11D90 && code <= 0x11D91) ? Extend : 0 // [2]
            ) : code <= 0x11D97 ? (
                code === 0x11D96 ? SpacingMark : Extend // [1 / 2]
            ) : 0
        ) : code < 0x16F4F ? (
            code <= 0x11EF6 ? (
                // Makasar
                code <= 0x11EF4 ? Extend : SpacingMark // [2 / 2]
            ) : code < 0x16AF0 ? (
                // Egyptian Hieroglyph Format Controls
                (code >= 0x13430 && code <= 0x13438) ? Control : 0 // [9]
            ) : code <= 0x16B36 ? ((
                // Bassa Vah
                code <= 0x16AF4 // [5]
                // Pahawh Hmong
                || code >= 0x16B30 // [7]
            ) ? Extend : 0) : 0
        ) : code < 0x1D165 ? (
            code <= 0x16F92 ? (
                // Miao
                (code >= 0x16F51 && code <= 0x16F87) ? SpacingMark // [55]
                    : (code === 0x16F4F || code >= 0x16F8F) ? Extend : 0 // [5]
            ) : code <= 0x16FF1 ? (
                // Ideographic Symbols and Punctuation
                code === 0x16FE4 ? Extend // [1]
                    : code >= 0x16FF0 ? SpacingMark : 0 // [2]
            ) : (code >= 0x1BC9D && code <= 0x1BCA3) ? (
                // Duployan
                code <= 0x1BC9E ? Extend // [2]
                    // Shorthand Format Controls
                    : code >= 0x1BCA0 ? Control : 0 // [4]
            ) : 0
        ) : code < 0x1DA00 ? (
            // Musical Symbols
            code <= 0x1D169 ? (
                code === 0x1D166 ? SpacingMark : Extend // [1 / 4]
            ) : code <= 0x1D17A ? (
                code < 0x1D16E
                    ? (code === 0x1D16D ? SpacingMark : 0) // [1]
                    : code >= 0x1D173 ? Control : Extend // [8 / 5]
            ) : code <= 0x1D244 ? ((
                code <= 0x1D182 // [8]
                || (code >= 0x1D185 && code <= 0x1D18B) // [7]
                || (code >= 0x1D1AA && code <= 0x1D1AD) // [4]
                // Ancient Greek Musical Notation
                || code >= 0x1D242 // [3]
            ) ? Extend : 0) : 0
        ) : (
            code <= 0x1DAAF ? (
                // Sutton SignWriting
                code <= 0x1DA36 // [55]
                || (code >= 0x1DA3B && code <= 0x1DA6C) // [50]
                || code === 0x1DA75 // [1]
                || code === 0x1DA84 // [1]
                || (code >= 0x1DA9B && code !== 0x1DAA0) // [20]
            ) : code <= 0x1E02A ? (code >= 0x1E000 && (
                // Glagolitic Supplement
                (code <= 0x1E018 && code !== 0x1E007) // [24]
                || (code >= 0x1E01B && code !== 0x1E022 && code !== 0x1E025) // [14]
            )) : code <= 0x1E2EF ? (code >= 0x1E130 && (
                // Nyiakeng Puachue Hmong
                code <= 0x1E136 // [7]
                // Wancho
                || code >= 0x1E2EC // [4]
            )) : (code >= 0x1E8D0 && code <= 0x1E94A && (
                // Mende Kikakui
                code <= 0x1E8D6 // [7]
                // Adlam
                || code >= 0x1E944 // [7]
            ))
        ) ? Extend : 0;
    }
    // Mahjong Tiles ... Symbols for Legacy Computing (1F000 - 1FBFF)
    if (code < 0x1FFFE) {
        return code < 0x1F200 ? (
            // Enclosed Alphanumeric Supplement
            code < 0x1F1AD ? ((code <= 0x1F171 ? (
                // Mahjong Tiles + Domino Tiles + Playing Cards
                code <= 0x1F0FF // [256]
                || (code >= 0x1F10D && code <= 0x1F10F) // [3]
                || code === 0x1F12F // [1]
                || code >= 0x1F16C // [6]
            ) : (code >= 0x1F17E && code <= 0x1F19A && (
                code <= 0x1F17F // [2]
                || code === 0x1F18E // [1]
                || code >= 0x1F191 // [10]
            ))) ? ExtendedPictographic : 0) : (
                code <= 0x1F1E5 ? ExtendedPictographic : RI // [57 / 26]
            )
        ) : code < 0x1F249 ? (
            // Enclosed Ideographic Supplement
            (code >= 0x1F201 && code <= 0x1F23F && (
                code <= 0x1F20F // [15]
                || code === 0x1F21A // [1]
                || code === 0x1F22F // [1]
                || (code >= 0x1F232 && code !== 0x1F23B) // [13]
            )) ? ExtendedPictographic : 0
        ) : code < 0x1F53E ? (
            // Miscellaneous Symbols and Pictographs
            (code >= 0x1F3FB && code <= 0x1F3FF) ? Extend : ExtendedPictographic // [5 / 752]
        ) : (code <= 0x1F7FF ? (code >= 0x1F546 && (
            // Miscellaneous Symbols and Pictographs + Emoticons
            code <= 0x1F64F // [266]
            // Transport and Map Symbols
            || (code >= 0x1F680 && code <= 0x1F6FF) // [128]
            // Alchemical Symbols
            || (code >= 0x1F774 && code <= 0x1F77F) // [12]
            // Geometric Shapes Extended
            || code >= 0x1F7D5 // [43]
        )) : code < 0x1F8AE ? (code >= 0x1F80C && code <= 0x1F88F && (
            // Supplemental Arrows-C
            code <= 0x1F80F // [4]
            || (code >= 0x1F848 && code <= 0x1F84F) // [8]
            || (code >= 0x1F85A && code <= 0x1F85F) // [6]
            || code >= 0x1F888 // [8]
        )) : (
            code <= 0x1F8FF // [82]
            // Supplemental Symbols and Pictographs + Chess Symbols + Symbols and Pictographs Extended-A
            || (code >= 0x1F90C && code <= 0x1FAFF && code !== 0x1F93B && code !== 0x1F946) // [498]
            // Symbols for Legacy Computing
            || code >= 0x1FC00 // [1,022]
        )) ? ExtendedPictographic : 0;
    }
    // Tags, Variation Selectors Supplement (E0000 - E01EF)
    if (code >= 0xE0000) {
        return code > 0xE0FFF ? 0 : (
            code >= 0xE01F0 // [3,600]
            || code <= 0xE001F // [32]
            || (code >= 0xE0080 && code <= 0xE00FF) // [128]
        ) ? Control : Extend; // [96 / 240]
    }
    return 0;
}

/**
 * Determines if there is a cluster boundary between two grapheme cluster break property values
 * Rules are from {@link http://unicode.org/reports/tr29/#Grapheme_Cluster_Boundary_Rules}
 * @param {number[]} breakProps - grapheme break properties for characters preceeding `prev`
 * @param {number} prev - grapheme break property of the previous character
 * @param {number} next - grapheme break property of the next character
 * @returns {boolean}
 */
function shouldBreak(breakProps, prev, next) {
    // Do not break between a CR and LF. Otherwise, break before and after controls.

    // GB3: CR × LF
    if (prev === CR && next === LF) {
        return false;
    }
    // GB4: (Control|CR|LF) ÷ Any
    if (prev === Control || prev === CR || prev === LF) {
        return true;
    }
    // GB5: Any ÷ (Control|CR|LF)
    if (next === Control || next === CR || next === LF) {
        return true;
    }

    // Do not break Hangul syllable sequences.

    // GB6: L × (L|V|LV|LVT)
    if (prev === L && (next === L || next === V || next === LV || next === LVT)) {
        return false;
    }
    // GB7: (LV|V) × (V|T)
    if ((prev === LV || prev === V) && (next === V || next === T)) {
        return false;
    }
    // GB8: (LVT|T) × T
    if ((prev === LVT || prev === T) && next === T) {
        return false;
    }

    // Do not break before extending characters or ZWJ.

    // GB9: Any × (Extend | ZWJ)
    if (next === Extend || next === ZWJ) {
        return false;
    }

    // Do not break before SpacingMarks, or after Prepend characters.

    // GB9a: Any × SpacingMark
    if (next === SpacingMark) {
        return false;
    }
    // GB9b: Prepend × Any
    if (prev === Prepend) {
        return false;
    }

    // Do not break within emoji modifier sequences or emoji zwj sequences.

    // GB11: ExtendedPictographic Extend* ZWJ × ExtendedPictographic
    if (prev === ZWJ && next === ExtendedPictographic) {
        let i = breakProps.length - 1;
        while (breakProps[i] === Extend) i -= 1;
        return breakProps[i] !== ExtendedPictographic;
    }

    // Do not break within emoji flag sequences

    // GB12: sot (RI RI)* RI × RI
    // GB13: [^RI] (RI RI)* RI × RI
    if (prev === RI && next === RI) {
        let i = breakProps.length - 1;
        while (breakProps[i] === RI) i -= 1;
        return (breakProps.length - 1 - i) % 2 === 1;
    }

    // GB999: Any ÷ Any
    return true;
}

module.exports = {
    graphemeBreakProperty,
    shouldBreak,
    classes: {
        CR,
        LF,
        Control,
        Extend,
        ZWJ,
        RI,
        Prepend,
        SpacingMark,
        L,
        V,
        T,
        LV,
        LVT,
        ExtendedPictographic,
    },
};