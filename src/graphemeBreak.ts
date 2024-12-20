const None = 0,
    CR = 1,
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
 * Base grapheme break properties
 */
export const GBProps = {
    None,
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
} as const;

const InCB_Extend = 0b00010000,
    InCB_Linker = 0b00100000,
    InCB_Consonant = 0b01000000;

export const Emoji_Modifier = 0b10000000;

/**
 * Indic conjunct break properties
 */
export const InCBProps = {
    Extend: InCB_Extend,
    Linker: InCB_Linker,
    Consonant: InCB_Consonant,
} as const;

/**
 * Get the grapheme cluster break property of a given Unicode code point
 *
 * @remarks
 * Properties are derived from {@link https://unicode.org/Public/16.0.0/ucd/auxiliary/GraphemeBreakProperty.txt}
 * Extended_Pictographic and Emoji_Modifier values are derived from {@link https://unicode.org/Public/16.0.0/ucd/emoji/emoji-data.txt}
 * InCB properties are derived from {@link https://www.unicode.org/Public/16.0.0/ucd/DerivedCoreProperties.txt}
 *
 * @param code - unicode code point
 * @returns The grapheme cluster break property
 */
export function graphemeBreakProperty(code: number) {
    // Basic Latin (0000 - 007F)
    if (code < 0x7F) {
        return code > 0x1F ? None
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
                : (code === 0xA9 || code === 0xAE) ? ExtendedPictographic : None
        ) : code >= 0x0300 ? Extend | InCB_Extend : None; // [112]
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
            )) ? Extend | InCB_Extend : None
        ) : code < 0x0700 ? (
            // Arabic
            code < 0x06D6 ? (
                code <= 0x0605 ? Prepend // [6]
                    : code === 0x061C ? Control : (
                        (code >= 0x0610 && code <= 0x061A) // [11]
                        || (code >= 0x064B && code <= 0x065F) // [21]
                        || code === 0x0670 // [1]
                    ) ? Extend | InCB_Extend : None
            ) : (code === 0x06DD) ? Prepend : (
                (code <= 0x06E4 && code !== 0x06DE) // [13]
                || (code >= 0x06E7 && code <= 0x06ED && code !== 0x06E9) // [6]
            ) ? Extend | InCB_Extend : None
        ) : code < 0x0800 ? (
            code <= 0x074A ? (
                // Syriac
                (code >= 0x0730 || code === 0x0711) ? Extend | InCB_Extend // [28]
                    : (code === 0x070F) ? Prepend : None // [1]
            ) : (code < 0x07EB ? (
                // Thaana
                code >= 0x07A6 && code <= 0x07B0 // [11]
            ) : (
                // Nko
                code <= 0x07F3 || code === 0x07FD // [10]
            )) ? Extend | InCB_Extend : None
        ) : code < 0x0903 ? (
            code <= 0x085B ? ((
                // Samaritan
                (code >= 0x0816 && code <= 0x0823 && code !== 0x081A) // [13]
                || (code >= 0x0825 && code <= 0x082D && code !== 0x0828) // [8]
                // Mandaic
                || code >= 0x0859 // [3]
            ) ? Extend | InCB_Extend : None) : code < 0x08CA ? (
                (code >= 0x0890 && code <= 0x0891) ? Prepend // [2]
                    : (code >= 0x0897 && code <= 0x089F) ? Extend | InCB_Extend : None // [9]
            ) : (
                // Arabic Extended-A
                code === 0x08E2 ? Prepend : Extend | InCB_Extend // [1/56]
            )
        ) : code < 0x0981 ? (
            // Devanagari
            code < 0x093E ? (
                (code === 0x0903 || code === 0x093B) ? SpacingMark // [2]
                    : code < 0x093A ? (code >= 0x0915 ? InCB_Consonant : None) // [37]
                        : code <= 0x093C ? Extend | InCB_Extend : None // [2]
            ) : code <= 0x094F ? (
                (code >= 0x0941 && code <= 0x0948) ? Extend | InCB_Extend // [8]
                    : code === 0x094D ? Extend | InCB_Linker : SpacingMark // [1/9]
            ) : code <= 0x095F ? (
                code < 0x0958 ? (
                    code >= 0x0951 ? Extend | InCB_Extend : None // [7]
                ) : InCB_Consonant // [8]
            ) : (code >= 0x0962 && code <= 0x0963) ? Extend | InCB_Extend // [2]
                : (code >= 0x0978 && code <= 0x097F) ? InCB_Consonant : None // [8]
        ) : code < 0x0A01 ? (
            // Bengali
            code <= 0x09B9 ? (
                code < 0x0995 ? (
                    code <= 0x0983 ? (code === 0x0981 ? Extend | InCB_Extend : SpacingMark) : None // [1/2]
                ) : (
                    (code <= 0x09B0 && code !== 0x09A9) // [27]
                    || code >= 0x09B6 // [4]
                    || code === 0x09B2 // [1]
                ) ? InCB_Consonant : None
            ) : code <= 0x09CC ? (
                code <= 0x09C4 ? (
                    code < 0x09BE ? (code === 0x09BC ? Extend | InCB_Extend : None) // [1]
                        : (code <= 0x09C0 && code >= 0x09BF) ? SpacingMark : Extend | InCB_Extend // [2/5]
                ) : (
                    code >= 0x09CB // [2]
                    || (code >= 0x09C7 && code <= 0x09C8) // [2]
                ) ? SpacingMark : None
            ) : code < 0x09E2 ? (
                code < 0x09DC ? (
                    code === 0x09CD ? Extend | InCB_Linker : code === 0x09D7 ? Extend | InCB_Extend : None // [1/1]
                ) : (code <= 0x09DD || code === 0x09DF) ? InCB_Consonant : None // [3]
            ) : code <= 0x09F1 ? (
                code <= 0x09E3 ? Extend | InCB_Extend : code >= 0x09F0 ? InCB_Consonant : None // [2/2]
            ) : code === 0x09FE ? Extend | InCB_Extend : None // [1]
        ) : code < 0x0A81 ? (
            // Gurmukhi
            code < 0x0A41 ? (
                (code === 0x0A03 || code >= 0x0A3E) ? SpacingMark // [4]
                    : (code <= 0x0A02 || code === 0x0A3C) ? Extend | InCB_Extend : None // [3]
            ) : (code <= 0x0A4D ? (
                code <= 0x0A42 // [2]
                || (code >= 0x0A47 && code <= 0x0A48) // [2]
                || code >= 0x0A4B // [3]
            ) : (
                code === 0x0A51 // [1]
                || (code >= 0x0A70 && code <= 0x0A71) // [2]
                || code === 0x0A75 // [1]
            )) ? Extend | InCB_Extend : None
        ) : code < 0x0B00 ? (
            // Gujarati
            code <= 0x0AB9 ? (
                code < 0x0A95 ? (
                    code <= 0x0A82 ? Extend | InCB_Extend : code === 0x0A83 ? SpacingMark : None // [2/1]
                ) : (code !== 0x0AA9 && code !== 0x0AB1 && code !== 0x0AB4) ? InCB_Consonant : None // [34]
            ) : code <= 0x0AC8 ? (
                (code >= 0x0ABE && code <= 0x0AC0) ? SpacingMark // [3]
                    : ((code >= 0x0AC1 && code !== 0x0AC6) || code === 0x0ABC) ? Extend | InCB_Extend : None // [8]
            ) : code < 0x0AE2 ? (
                code <= 0x0ACC ? (code !== 0x0ACA ? SpacingMark : None) // [3]
                    : code === 0x0ACD ? Extend | InCB_Linker : None // [1]
            ) : (code >= 0x0AFA || code <= 0x0AE3) ? Extend | InCB_Extend // [8]
                : code === 0x0AF9 ? InCB_Consonant : None // [1]
        ) : code < 0x0B80 ? (
            // Oriya
            code <= 0x0B39 ? (
                code < 0x0B15 ? (
                    (code >= 0x0B02 && code <= 0x0B03) ? SpacingMark // [2]
                        : code === 0x0B01 ? Extend | InCB_Extend : None // [1]
                ) : (
                    (code <= 0x0B30 && code !== 0x0B29) // [27]
                    || (code >= 0x0B32 && code !== 0x0B34) // [7]
                ) ? InCB_Consonant : None
            ) : code <= 0x0B4C ? (
                code <= 0x0B44 ? (
                    code === 0x0B40 ? SpacingMark // [1]
                        : (code >= 0x0B3E || code === 0x0B3C) ? Extend | InCB_Extend : None // [7]
                ) : ((code >= 0x0B47 && code <= 0x0B48) || code >= 0x0B4B) ? SpacingMark : None // [4]
            ) : code < 0x0B5C ? (
                code < 0x0B55 ? (code === 0x0B4D ? Extend | InCB_Linker : None) // [1]
                    : code <= 0x0B57 ? Extend | InCB_Extend : None // [3]
            ) : code < 0x0B62 ? (
                (code <= 0x0B5D || code === 0x0B5F) ? InCB_Consonant : None // [3]
            ) : code <= 0x0B63 ? Extend | InCB_Extend : code === 0x0B71 ? InCB_Consonant : None // [2/1]
        ) : code < 0x0C00 ? (
            // Tamil
            code < 0x0BC1 ? (
                (code === 0x0BBF) ? SpacingMark // [1]
                    : (code === 0x0B82 || code >= 0x0BBE) ? Extend | InCB_Extend : None // [3]
            ) : code <= 0x0BCC ? ((
                code <= 0x0BC2 // [2]
                || (code >= 0x0BC6 && code <= 0x0BC8) // [3]
                || code >= 0x0BCA // [3]
            ) ? SpacingMark : None) : (
                code === 0x0BCD // [1]
                || code === 0x0BD7 // [1]
            ) ? Extend | InCB_Extend : None
        ) : code < 0x0C64 ? (
            // Telugu
            code < 0x0C3E ? (
                code <= 0x0C04 ? ((code >= 0x0C01 && code <= 0x0C03) ? SpacingMark : Extend | InCB_Extend) // [3/2]
                    : (code >= 0x0C15 && code <= 0x0C39 && code !== 0x0C29) ? InCB_Consonant // [36]
                        : code === 0x0C3C ? Extend | InCB_Extend : None // [1]
            ) : code <= 0x0C4C ? (
                (code <= 0x0C44 && code >= 0xC41) ? SpacingMark // [4]
                    : (code <= 0x0C40 || (code >= 0x0C46 && code !== 0x0C49)) ? Extend | InCB_Extend : None // [9]
            ) : code <= 0x0C5A ? (
                code === 0x0C4D ? Extend | InCB_Linker // [1]
                    : (code >= 0x0C55 && code <= 0x0C56) ? Extend | InCB_Extend // [2]
                        : code >= 0x0C58 ? InCB_Consonant : None // [3]
            ) : code >= 0x0C62 ? Extend | InCB_Extend : None // [2]
        ) : code < 0x0D00 ? (
            // Kannada
            code <= 0x0CC4 ? (
                code < 0x0CBC ? (
                    (code >= 0x0C82 && code <= 0x0C83) ? SpacingMark // [2]
                        : code === 0x0C81 ? Extend | InCB_Extend : None // [1]
                ) : code < 0x0CC1 ? (
                    code === 0x0CBE ? SpacingMark // [1]
                        : code !== 0x0CBD ? Extend | InCB_Extend : None // [3]
                ) : code === 0x0CC2 ? Extend | InCB_Extend : SpacingMark // [1/3]
            ) : code <= 0x0CE3 ? ((
                (code >= 0x0CC6 && code <= 0x0CC8) // [3]
                || (code >= 0x0CCA && code <= 0x0CCD) // [4]
                || (code >= 0x0CD5 && code <= 0x0CD6) // [2]
                || code >= 0x0CE2 // [2]
            ) ? Extend | InCB_Extend : None)
                : code === 0x0CF3 ? SpacingMark : None // [1]
        ) : code < 0x0D64 ? (
            // Malayalam
            code <= 0x0D44 ? (
                code < 0x0D3B ? (
                    code >= 0x0D15 ? InCB_Consonant // [38]
                        : code <= 0x0D01 ? Extend | InCB_Extend // [2]
                            : code <= 0x0D03 ? SpacingMark : None // [2]
                ) : (code >= 0x0D3F && code <= 0x0D40) ? SpacingMark // [2]
                    : code !== 0x0D3D ? Extend | InCB_Extend : None // [7]
            ) : code <= 0x0D4C ? (
                (code >= 0x0D46 && code !== 0x0D49) ? SpacingMark : None // [6]
            ) : code === 0x0D4D ? Extend | InCB_Linker : (
                code === 0x0D57 // [1]
                || code >= 0x0D62 // [2]
            ) ? Extend | InCB_Extend : (code === 0x0D4E) ? Prepend : None
        ) : code < 0x0DF4 ? (
            // Sinhala
            code <= 0x0DD4 ? ((
                (code >= 0x0D82 && code <= 0x0D83) // [2]
                || (code >= 0x0DD0 && code <= 0x0DD1) // [2]
            ) ? SpacingMark
                : (code === 0x0D81 || code === 0x0DCA || code >= 0x0DCF) ? Extend | InCB_Extend : None // [6]
            ) : (code === 0x0DD6 || code === 0x0DDF) ? Extend | InCB_Extend // [2]
                : ((code >= 0x0DD8 && code <= 0x0DDE) || code >= 0x0DF2) ? SpacingMark : None // [9]
        ) : code < 0x0F18 ? (
            code <= 0x0E4E ? (
                // Thai
                code === 0x0E33 ? SpacingMark : ( // [1]
                    (code >= 0x0E31 && code <= 0x0E3A && code !== 0x0E32) // [8]
                    || code >= 0x0E47 // [8]
                ) ? Extend | InCB_Extend : None
            ) : (
                // Lao
                code === 0x0EB3 ? SpacingMark : ( // [1]
                    (code >= 0x0EB1 && code <= 0x0EBC && code !== 0x0EB2) // [10]
                    || (code >= 0x0EC8 && code <= 0x0ECE) // [7]
                ) ? Extend | InCB_Extend : None
            )
        ) : code < 0x102D ? (
            // Tibetan
            code < 0x0F71 ? (
                code <= 0x0F39 ? ((
                    code <= 0x0F19 // [2]
                    || (code >= 0x0F35 && code !== 0x0F36 && code !== 0x0F38) // [3]
                ) ? Extend | InCB_Extend : None) : (
                    code <= 0x0F3F && code >= 0x0F3E // [2]
                ) ? SpacingMark : None
            ) : code <= 0x0F87 ? (
                code === 0x0F7F ? SpacingMark : code !== 0x0F85 ? Extend | InCB_Extend : None // [1/21]
            ) : (
                (code >= 0x0F8D && code <= 0x0FBC && code !== 0x0F98) // [47]
                || code === 0x0FC6 // [1]
            ) ? Extend | InCB_Extend : None
        ) : (
            // Myanmar
            code <= 0x103E ? (
                (code === 0x1031 || (code >= 0x103B && code <= 0x103C)) ? SpacingMark // [3]
                    : code !== 0x1038 ? Extend | InCB_Extend : None // [14]
            ) : code < 0x1085 ? (
                ((code >= 0x1056 && code <= 0x1057) || code === 0x1084) ? SpacingMark : ( // [3]
                    (code >= 0x1058 && code <= 0x1059) // [2]
                    || (code >= 0x105E && code <= 0x1060) // [3]
                    || (code >= 0x1071 && code <= 0x1074) // [4]
                    || code === 0x1082 // [1]
                ) ? Extend | InCB_Extend : None
            ) : (
                code <= 0x1086 // [2]
                || code === 0x108D // [1]
                || code === 0x109D // [1]
            ) ? Extend | InCB_Extend : None
        );
    }
    // Hangul Jamo ... Vedic Extensions (1100 - 1CFF)
    if (code < 0x1D00) {
        return code < 0x1200 ? (
            // Hangul Jamo
            (code < 0x1160) ? L : (code < 0x11A8) ? V : T // L [96] V [72] T [88]
        ) : code < 0x1774 ? (
            (code <= 0x1715 ? (
                // Ethiopic
                (code >= 0x135D && code <= 0x135F) // [3]
                // Tagalog
                || code >= 0x1712 // [4]
            ) : (
                // Hanunoo
                (code >= 0x1732 && code <= 0x1734) // [3]
                // Buhid
                || (code >= 0x1752 && code <= 0x1753) // [2]
                // Tagbanwa
                || code >= 0x1772 // [2]
            )) ? Extend | InCB_Extend : None
        ) : code < 0x180B ? (
            // Khmer
            (code >= 0x17B4 && code <= 0x17D3) ? (
                (code === 0x17B6 || (code >= 0x17BE && code <= 0x17C5) || (code >= 0x17C7 && code <= 0x17C8))
                    ? SpacingMark : Extend | InCB_Extend // [11/21]
            ) : code === 0x17DD ? Extend | InCB_Extend : None // [1]
        ) : code < 0x1920 ? (
            // Mongolian
            (code === 0x180E) ? Control // [1]
                : (code <= 0x180F || (code >= 0x1885 && code <= 0x1886) || code === 0x18A9)
                    ? Extend | InCB_Extend : None // [7]
        ) : code < 0x1A55 ? (
            code <= 0x193B ? (
                // Limbu
                code <= 0x192B ? (
                    (code <= 0x1922 || (code >= 0x1927 && code <= 0x1928)) ? Extend | InCB_Extend : SpacingMark // [5/7]
                ) : code >= 0x1930 ? (
                    (code >= 0x1939 || code === 0x1932) ? Extend | InCB_Extend : SpacingMark // [4/8]
                ) : None
            ) : (code >= 0x1A17 && code <= 0x1A1B) ? (
                // Buginese
                (code >= 0x1A19 && code <= 0x1A1A) ? SpacingMark : Extend | InCB_Extend // [2/3]
            ) : None
        ) : code < 0x1B00 ? (
            // Tai Tham
            code < 0x1A65 ? (
                code <= 0x1A5E ? (
                    (code >= 0x1A58 || code === 0x1A56) ? Extend | InCB_Extend : SpacingMark // [8/2]
                ) : (code === 0x1A60 || code === 0x1A62) ? Extend | InCB_Extend : None // [2]
            ) : code <= 0x1A7C ? (
                (code <= 0x1A6C || code >= 0x1A73) ? Extend | InCB_Extend : SpacingMark // [18/6]
            ) : (
                code === 0x1A7F // [1]
                // Combining Diacritical Marks Extended
                || (code >= 0x1AB0 && code <= 0x1ACE) // [31]
            ) ? Extend | InCB_Extend : None
        ) : code < 0x1B80 ? (
            // Balinese
            code < 0x1B34 ? (
                code <= 0x1B03 ? Extend | InCB_Extend // [4]
                    : code === 0x1B04 ? SpacingMark : None // [1]
            ) : code <= 0x1B44 ? (
                (code <= 0x1B3D || code >= 0x1B42) ? Extend | InCB_Extend : SpacingMark // [13/4]
            ) : (
                code >= 0x1B6B && code <= 0x1B73 // [9]
            ) ? Extend | InCB_Extend : None
        ) : code < 0x1BE6 ? (
            // Sundanese
            code < 0x1BA2 ? (
                code <= 0x1B81 ? Extend | InCB_Extend // [2]
                    : (code === 0x1B82 || code === 0x1BA1) ? SpacingMark : None // [2]
            ) : code <= 0x1BAD ? (
                (code <= 0x1BA5 || code >= 0x1BA8) ? Extend | InCB_Extend : SpacingMark // [10/2]
            ) : None
        ) : code < 0x1CD0 ? (
            code <= 0x1BF3 ? (
                // Batak
                ((code >= 0x1BEA && code <= 0x1BEC) || code === 0x1BE7 || code === 0x1BEE)
                    ? SpacingMark : Extend | InCB_Extend // [5/9]
            ) : (code >= 0x1C24 && code <= 0x1C37) ? (
                // Lepcha
                (code <= 0x1C2B || (code >= 0x1C34 && code <= 0x1C35)) ? SpacingMark : Extend | InCB_Extend // [10/10]
            ) : None
        ) : (
            // Vedic Extensions
            (code === 0x1CE1 || code === 0x1CF7) ? SpacingMark : (
                code <= 0x1CD2 // [3]
                || (code >= 0x1CD4 && code <= 0x1CE8) // [20]
                || code === 0x1CED || code === 0x1CF4 // [2]
                || (code >= 0x1CF8 && code <= 0x1CF9) // [2]
            ) ? Extend | InCB_Extend : None
        );
    }
    // Phonetic Extensions ... Combining Diacritical Marks for Symbols (1D00 - 20FF)
    if (code < 0x2100) {
        return code < 0x200B ? (
            // Combining Diacritical Marks Supplement
            (code >= 0x1DC0 && code <= 0x1DFF) ? Extend | InCB_Extend : None // [64]
        ) : code === 0x200D ? ZWJ | InCB_Extend : code <= 0x206F ? (
            // General Punctuation
            code === 0x200C ? Extend : (
                code <= 0x200F // [3]
                || (code >= 0x2028 && code <= 0x202E) // [7]
                || code >= 0x2060 // [16]
            ) ? Control : (code === 0x203C || code === 0x2049) ? ExtendedPictographic : None
        ) : (
            // Combining Diacritical Marks for Symbols
            code >= 0x20D0 && code <= 0x20F0 // [33]
        ) ? Extend | InCB_Extend : None;
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
        )) ? ExtendedPictographic : None;
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
            )) ? Extend | InCB_Extend : None
        ) : code < 0x3300 ? (
            code <= 0x309A ? (
                // CJK Symbols and Punctuation + Hiragana
                (code <= 0x302F || code >= 0x3099) ? Extend | InCB_Extend // [8]
                    : (code === 0x3030 || code === 0x303D) ? ExtendedPictographic : None // [2]
            ) : (
                // Enclosed CJK Letters and Months
                code === 0x3297 || code === 0x3299 // [2]
            ) ? ExtendedPictographic : None
        ) : code < 0xA800 ? (
            (code >= 0xA66F && code <= 0xA6F1 && (
                // Cyrillic Extended-B
                (code <= 0xA67D && code !== 0xA673) // [14]
                || (code >= 0xA69E && code <= 0xA69F) // [2]
                || code >= 0xA6F0 // [2]
            )) ? Extend | InCB_Extend : None
        ) : code < 0xA880 ? (
            // Syloti Nagri
            code < 0xA823 ? (
                (code === 0xA802 || code === 0xA806 || code === 0xA80B) ? Extend | InCB_Extend : None // [3]
            ) : code <= 0xA827 ? (
                (code >= 0xA825 && code <= 0xA826) ? Extend | InCB_Extend : SpacingMark // [2/3]
            ) : code === 0xA82C ? Extend | InCB_Extend : None // [1]
        ) : code < 0xA900 ? (
            // Saurashtra, Devanagari Extended
            code < 0xA8C4 ? (
                (code <= 0xA881 || code >= 0xA8B4) ? SpacingMark : None // [18]
            ) : (
                code <= 0xA8C5 // [2]
                || (code >= 0xA8E0 && code <= 0xA8F1) // [18]
                || code === 0xA8FF // [1]
            ) ? Extend | InCB_Extend : None
        ) : code < 0xA980 ? (
            code < 0xA947 ? (
                // Kayah Li
                (code >= 0xA926 && code <= 0xA92D) ? Extend | InCB_Extend : None // [8]
            ) : code <= 0xA953 ? (
                // Rejang
                code === 0xA952 ? SpacingMark : Extend | InCB_Extend // [1/12]
            ) : (
                // Hangul Jamo Extended-A
                code >= 0xA960 && code <= 0xA97C // [29]
            ) ? L : None
        ) : code < 0xAA29 ? (
            // Javanese
            code < 0xA9B4 ? (
                (code <= 0xA982 || code === 0xA9B3) ? Extend | InCB_Extend // [4]
                    : code === 0xA983 ? SpacingMark : None // [1]
            ) : code < 0xA9C0 ? (
                (code <= 0xA9B5 || (code >= 0xA9BA && code <= 0xA9BB) || code >= 0xA9BE)
                    ? SpacingMark : Extend | InCB_Extend // [6/6]
            ) : (
                code === 0xA9C0 // [1]
                // Myanmar Extended-B
                || code === 0xA9E5 // [1]
            ) ? Extend | InCB_Extend : None
        ) : code < 0xAA80 ? (
            // Cham, Myanmar Extended-A
            code <= 0xAA36 ? (
                (code <= 0xAA2E || (code >= 0xAA31 && code <= 0xAA32) || code >= 0xAA35)
                    ? Extend | InCB_Extend : SpacingMark // [10/4]
            ) : (code === 0xAA43 || code === 0xAA4C || code === 0xAA7C) ? Extend | InCB_Extend // [3]
                : (code === 0xAA4D) ? SpacingMark : None // [1]
        ) : code < 0xAB00 ? (
            code < 0xAAEB ? ((
                // Tai Viet
                (code >= 0xAAB0 && code <= 0xAAB4 && code !== 0xAAB1) // [4]
                || (code >= 0xAAB7 && code <= 0xAAB8) // [2]
                || (code >= 0xAABE && code <= 0xAAC1 && code !== 0xAAC0) // [3]
            ) ? Extend | InCB_Extend : None) : code <= 0xAAEF ? (
                // Meetei Mayek Extensions
                (code >= 0xAAEC && code <= 0xAAED) ? Extend | InCB_Extend : SpacingMark // [2/3]
            ) : (code === 0xAAF5) ? SpacingMark // [1]
                : (code === 0xAAF6) ? Extend | InCB_Extend : None // [1]
        ) : code >= 0xABE3 ? (
            // Meetei Mayek
            code <= 0xABEA ? (
                (code === 0xABE5 || code === 0xABE8) ? Extend | InCB_Extend : SpacingMark // [2/6]
            ) : (code === 0xABEC) ? SpacingMark // [1]
                : (code === 0xABED) ? Extend | InCB_Extend : None // [1]
        ) : None;
    }
    // Hangul Syllables ... Specials (AC00 - FFFF)
    if (code < 0x10000) {
        return code <= 0xD7A3 ? (
            // Hangul Syllable
            ((code - 0xAC00) % 28 ? LVT : LV) // [11,172]
        ) : code <= 0xD7FB ? (
            // Hangul Jamo Extended-B
            code >= 0xD7CB ? T // [49]
                : (code >= 0xD7B0 && code <= 0xD7C6) ? V : None // [23]
        ) : code <= 0xFE2F ? (
            (code < 0xFE00 ? (
                // Alphabetic Presentation Forms
                code === 0xFB1E // [1]
            ) : (
                // Variation Selectors
                code <= 0xFE0F // [16]
                // Combining Half Marks
                || code >= 0xFE20 // [16]
            )) ? Extend | InCB_Extend : None
        ) : (
            // Zero Width No-Break Space + Specials
            (code === 0xFEFF || (code >= 0xFFF0 && code <= 0xFFFB)) ? Control // [1]
                // Halfwidth and Fullwidth Forms
                : (code >= 0xFF9E && code <= 0xFF9F) ? Extend | InCB_Extend : None // [2]
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
            ) : code < 0x10EFC ? (
                // Manichaean
                code <= 0x10AE6 // [2]
                // Hanifi Rohingya
                || (code >= 0x10D24 && code <= 0x10D27) // [4]
                // Garay
                || (code >= 0x10D69 && code <= 0x10D6D) // [5]
                // Yezidi
                || (code >= 0x10EAB && code <= 0x10EAC) // [2]
            ) : (
                // Arabic Extended-C
                code <= 0x10EFF // [4]
                // Sogdian
                || (code >= 0x10F46 && code <= 0x10F50) // [11]
                // Old Uyghur
                || (code >= 0x10F82 && code <= 0x10F85) // [4]
            )) ? Extend | InCB_Extend : None
        ) : code < 0x11082 ? (
            // Brahmi
            code <= 0x11002 ? (
                code === 0x11001 ? Extend | InCB_Extend : SpacingMark // [1/2]
            ) : (code < 0x11073 ? (
                (code >= 0x11038 && code <= 0x11046) // [15]
                || code === 0x11070 // [1]
            ) : (
                code <= 0x11074 // [2]
                || code >= 0x1107F // [3]
            )) ? Extend | InCB_Extend : None
        ) : code < 0x11100 ? (
            // Kaithi
            code <= 0x110BA ? (
                code < 0x110B0 ? (code === 0x11082 ? SpacingMark : None) // [1]
                    : (code <= 0x110B2 || (code >= 0x110B7 && code <= 0x110B8))
                        ? SpacingMark : Extend | InCB_Extend // [5/6]
            ) : (code === 0x110BD || code === 0x110CD) ? Prepend // [2]
                : (code === 0x110C2) ? Extend | InCB_Extend : None // [1]
        ) : code < 0x11180 ? (
            // Chakma
            code <= 0x11134 ? (
                code === 0x1112C ? SpacingMark // [1]
                    : (code <= 0x11102 || code >= 0x11127) ? Extend | InCB_Extend : None // [16]
            ) : code <= 0x11146 ? (
                code >= 0x11145 ? SpacingMark : None // [2]
            ) : (
                // Mahajani
                code === 0x11173 ? Extend | InCB_Extend : None // [1]
            )
        ) : code < 0x1122C ? (
            // Sharada
            code <= 0x111C0 ? (
                code < 0x111B6 ? (
                    code <= 0x11181 ? Extend | InCB_Extend // [2]
                        : (code === 0x11182 || code >= 0x111B3) ? SpacingMark : None // [4]
                ) : code === 0x111BF ? SpacingMark : Extend | InCB_Extend // [1/10]
            ) : code <= 0x111CC ? (
                code >= 0x111C9 ? Extend | InCB_Extend // [4]
                    : (code <= 0x111C3 && code >= 0x111C2) ? Prepend : None // [2]
            ) : code === 0x111CE ? SpacingMark : code === 0x111CF ? Extend | InCB_Extend : None // [1/1]
        ) : code < 0x11300 ? (
            // Khojki
            code <= 0x11237 ? (
                (code <= 0x1122E || (code >= 0x11232 && code <= 0x11233)) ? SpacingMark : Extend | InCB_Extend // [5/7]
            ) : code < 0x112DF ? (
                (code === 0x1123E || code === 0x11241) ? Extend | InCB_Extend : None // [2]
            ) : code <= 0x112EA ? (
                // Khudawadi
                (code >= 0x112E0 && code <= 0x112E2) ? SpacingMark : Extend | InCB_Extend // [3/9]
            ) : None
        ) : code < 0x11375 ? (
            // Grantha
            code < 0x11341 ? (
                code < 0x1133B ? (
                    code <= 0x11303 ? (code <= 0x11301 ? Extend | InCB_Extend : SpacingMark) : None // [2/2]
                ) : code === 0x1133F ? SpacingMark // [1]
                    : code !== 0x1133D ? Extend | InCB_Extend : None // [4]
            ) : code < 0x1134D ? ((
                code <= 0x11344 // [4]
                || (code >= 0x11347 && code <= 0x11348) // [2]
                || code >= 0x1134B // [2]
            ) ? SpacingMark : None) : code <= 0x11363 ? (
                code >= 0x11362 ? SpacingMark // [2]
                    : (code === 0x1134D || code === 0x11357) ? Extend | InCB_Extend : None // [2]
            ) : ((code >= 0x11366 && code <= 0x1136C) || code >= 0x11370) ? Extend | InCB_Extend : None // [12]
        ) : code < 0x113E3 ? (
            // Tulu-Tigalari
            code <= 0x113C2 ? (code >= 0x113B8 ? (
                (code >= 0x113B9 && code <= 0x113BA) ? SpacingMark // [2]
                    : code !== 0x113C1 ? Extend | InCB_Extend : None // [8]
            ) : None) : code <= 0x113C9 ? (
                (code === 0x113C5 || code >= 0x113C7) ? Extend | InCB_Extend : None // [4]
            ) : code < 0x113CE ? (
                code !== 0x113CB ? SpacingMark : None // [3]
            ) : code === 0x113D1 ? Prepend // [1]
                : (code <= 0x113D2 || code >= 0x113E1) ? Extend | InCB_Extend : None // [6]
        ) : (
            // Newa
            code <= 0x11444 ? (
                code >= 0x11435 ? (
                    (code <= 0x11437 || (code >= 0x11440 && code <= 0x11441))
                        ? SpacingMark : Extend | InCB_Extend // [5/11]
                ) : None
            ) : code === 0x11445 ? SpacingMark // [1]
                : (code === 0x11446 || code === 0x1145E) ? Extend | InCB_Extend : None // [2]
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
            ) ? SpacingMark : Extend | InCB_Extend) : None
        ) : code < 0x11630 ? (
            // Siddham
            code <= 0x115BB ? (
                ((code >= 0x115B0 && code <= 0x115B1) || code >= 0x115B8) ? SpacingMark // [6]
                    : code <= 0x115B5 ? Extend | InCB_Extend : None // [5]
            ) : code <= 0x115C0 ? (
                code === 0x115BE ? SpacingMark : Extend | InCB_Extend // [1/4]
            ) : (code >= 0x115DC && code <= 0x115DD) ? Extend | InCB_Extend : None // [2]
        ) : code < 0x116AB ? (
            // Modi
            code <= 0x11640 ? ((
                code <= 0x11632 // [3]
                || (code >= 0x1163B && code <= 0x1163C) // [2]
                || code === 0x1163E // [1]
            ) ? SpacingMark : Extend | InCB_Extend) : None
        ) : code < 0x1171D ? (
            // Takri
            code <= 0x116B7 ? (
                (code === 0x116AC || (code >= 0x116AE && code <= 0x116AF))
                    ? SpacingMark : Extend | InCB_Extend // [3/10]
            ) : None
        ) : code < 0x11930 ? (
            code <= 0x1172B ? (
                // Ahom
                (code === 0x1171E || code === 0x11726) ? SpacingMark // [2]
                    : (code <= 0x1171F || code >= 0x11722) ? Extend | InCB_Extend : None // [11]
            ) : (code >= 0x1182C && code <= 0x1183A) ? (
                // Dogra
                (code <= 0x1182E || code === 0x11838) ? SpacingMark : Extend | InCB_Extend // [4/11]
            ) : None
        ) : code < 0x119D1 ? (
            // Dives Akuru
            code < 0x1193B ? (
                (code === 0x11930) ? Extend | InCB_Extend // [1]
                    : (code <= 0x11938 && code !== 0x11936) ? SpacingMark : None // [7]
            ) : code <= 0x11943 ? (
                (code <= 0x1193E || code === 0x11943) ? Extend | InCB_Extend // [5]
                    : (code === 0x1193F || code === 0x11941) ? Prepend : SpacingMark // [2/2]
            ) : None
        ) : code < 0x11A01 ? (
            // Nandinagari
            code <= 0x119D7 ? (
                code <= 0x119D3 ? SpacingMark : Extend | InCB_Extend // [3/4]
            ) : (code >= 0x119DA && code <= 0x119E0) ? (
                (code >= 0x119DC && code <= 0x119DF) ? SpacingMark : Extend | InCB_Extend // [4/3]
            ) : (code === 0x119E4) ? SpacingMark : None // [1]
        ) : code < 0x11A51 ? (
            // Zanabazar Square
            code < 0x11A33 ? (
                code <= 0x11A0A ? Extend | InCB_Extend : None // [10]
            ) : code <= 0x11A3E ? (
                (code <= 0x11A38 || code >= 0x11A3B) ? Extend | InCB_Extend // [10]
                    : code === 0x11A39 ? SpacingMark : Prepend // [1/1]
            ) : (code === 0x11A47) ? Extend | InCB_Extend : None // [1]
        ) : (
            // Soyombo
            code <= 0x11A5B ? (
                (code >= 0x11A57 && code <= 0x11A58) ? SpacingMark : Extend | InCB_Extend // [2/9]
            ) : (code >= 0x11A84 && code <= 0x11A99) ? (
                code <= 0x11A89 ? Prepend // [6]
                    : code === 0x11A97 ? SpacingMark : Extend | InCB_Extend // [1/15]
            ) : None
        );
    }
    // Bhaiksuki ... Arabic Mathematical Alphabetic Symbols (11C00 - 1EEFF)
    if (code < 0x1F000) {
        return code < 0x11D31 ? (
            code <= 0x11C3F ? (code >= 0x11C2F ? (
                // Bhaiksuki
                (code === 0x11C2F || code === 0x11C3E) ? SpacingMark // [2]
                    : code !== 0x11C37 ? Extend | InCB_Extend : None // [14]
            ) : None) : (code >= 0x11C92 && code <= 0x11CB6) ? (
                // Marchen
                (code === 0x11CA9 || code === 0x11CB1 || code === 0x11CB4) ? SpacingMark // [3]
                    : code !== 0x11CA8 ? Extend | InCB_Extend : None
            ) : None
        ) : code < 0x11D8A ? (
            // Masaram Gondi
            code < 0x11D3C ? (
                (code <= 0x11D36 || code === 0x11D3A) ? Extend | InCB_Extend : None // [7]
            ) : (code <= 0x11D47 && code !== 0x11D3E) ? (
                code === 0x11D46 ? Prepend : Extend | InCB_Extend // [1/10]
            ) : None
        ) : code < 0x11EF3 ? (
            // Gunjala Gondi
            code <= 0x11D94 ? (
                (code <= 0x11D8E || code >= 0x11D93) ? SpacingMark // [7]
                    : (code >= 0x11D90 && code <= 0x11D91) ? Extend | InCB_Extend : None // [2]
            ) : code <= 0x11D97 ? (
                code === 0x11D96 ? SpacingMark : Extend | InCB_Extend // [1/2]
            ) : None
        ) : code < 0x13430 ? (
            code <= 0x11F42 ? (
                code < 0x11F00 ? (code <= 0x11EF6 ? (
                    // Makasar
                    code <= 0x11EF4 ? Extend | InCB_Extend : SpacingMark // [2/2]
                ) : None) : code < 0x11F34 ? (code <= 0x11F03 ? (
                    code <= 0x11F01 ? Extend | InCB_Extend // [2]
                        : code === 0x11F02 ? Prepend : SpacingMark // [1/1]
                ) : None) : code < 0x11F3E ? (
                    code <= 0x11F35 ? SpacingMark // 2
                        : code <= 0x11F3A ? Extend | InCB_Extend : None // [5]
                ) : code <= 0x11F3F ? SpacingMark : Extend | InCB_Extend // [2/3]
            ) : code === 0x11F5A ? Extend | InCB_Extend : None // [1]
        ) : code < 0x16F4F ? (
            code < 0x1611E ? (
                // Egyptian Hieroglyph Format Controls
                code <= 0x13455 ? (
                    code <= 0x1343F ? Control // [16]
                        : (code >= 0x13447 || code === 0x13440) ? Extend | InCB_Extend : None // [16]
                ) : None
            ) : code <= 0x16B36 ? (
                code <= 0x1612F ? (
                    // Gurung Khema
                    (code <= 0x16129 || code >= 0x1612D) ? Extend | InCB_Extend : SpacingMark // [15/3]
                ) : (code >= 0x16AF0 && code <= 0x16B36) ? ((
                    // Bassa Vah
                    code <= 0x16AF4 // [5]
                    // Pahawh Hmong
                    || code >= 0x16B30 // [7]
                ) ? Extend | InCB_Extend : None) : None
            ) : (
                // Kirat Rai
                code === 0x16D63 // [1]
                || (code >= 0x16D67 && code <= 0x16D6A) // [4]
            ) ? V : None
        ) : code < 0x1D165 ? (
            code <= 0x16F92 ? (
                // Miao
                (code >= 0x16F51 && code <= 0x16F87) ? SpacingMark // [55]
                    : (code === 0x16F4F || code >= 0x16F8F) ? Extend | InCB_Extend : None // [5]
            ) : code <= 0x16FF1 ? (
                // Ideographic Symbols and Punctuation
                (code === 0x16FE4 || code >= 0x16FF0) ? Extend | InCB_Extend : None // [3]
            ) : (code >= 0x1BC9D && code <= 0x1BCA3) ? (
                // Duployan
                code <= 0x1BC9E ? Extend | InCB_Extend // [2]
                    // Shorthand Format Controls
                    : code >= 0x1BCA0 ? Control : None // [4]
            ) : (code >= 0x1CF00 && code <= 0x1CF46) ? (
                // Znamenny Musical Notation
                (code <= 0x1CF2D || code >= 0x1CF30) ? Extend | InCB_Extend : None // [69]
            ) : None
        ) : code < 0x1DAB0 ? (
            // Musical Symbols
            code < 0x1D17B ? (
                code < 0x1D173 ? (
                    (code <= 0x1D169 || code >= 0x1D16D) ? Extend | InCB_Extend : None // [11]
                ) : Control // [8]
            ) : (code <= 0x1D244 ? (
                code <= 0x1D182 // [8]
                || (code >= 0x1D185 && code <= 0x1D18B) // [7]
                || (code >= 0x1D1AA && code <= 0x1D1AD) // [4]
                // Ancient Greek Musical Notation
                || code >= 0x1D242
            ) : (code >= 0x1DA00 && (
                // Sutton SignWriting
                code <= 0x1DA36 // [55]
                || (code >= 0x1DA3B && code <= 0x1DA6C) // [50]
                || code === 0x1DA75 // [1]
                || code === 0x1DA84 // [1]
                || (code >= 0x1DA9B && code !== 0x1DAA0) // [20]
            ))) ? Extend | InCB_Extend : None
        ) : (code <= 0x1E02A ? (code >= 0x1E000 && (
            // Glagolitic Supplement
            (code <= 0x1E018 && code !== 0x1E007) // [24]
            || (code >= 0x1E01B && code !== 0x1E022 && code !== 0x1E025) // [14]
        )) : code <= 0x1E4EF ? (code <= 0x1E136 ? (
            // Cyrillic Extended-D
            code === 0x1E08F // [1]
            // Nyiakeng Puachue Hmong
            || code >= 0x1E130 // [7]
        ) : (
            // Toto
            code === 0x1E2AE // [1]
            // Wancho
            || (code >= 0x1E2EC && code <= 0x1E2EF) // [4]
            // Nag Mundari
            || code >= 0x1E4EC // [4]
        )) : code < 0x1E8D0 ? (
            // Ol Onal
            code >= 0x1E5EE && code <= 0x1E5EF // [2]
        ) : (code <= 0x1E94A && (
            // Mende Kikakui
            code <= 0x1E8D6 // [7]
            // Adlam
            || code >= 0x1E944 // [7]
        ))) ? Extend | InCB_Extend : None;
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
            ))) ? ExtendedPictographic : None) : (
                code <= 0x1F1E5 ? ExtendedPictographic : RI // [57/26]
            )
        ) : code < 0x1F249 ? (
            // Enclosed Ideographic Supplement
            (code >= 0x1F201 && code <= 0x1F23F && (
                code <= 0x1F20F // [15]
                || code === 0x1F21A // [1]
                || code === 0x1F22F // [1]
                || (code >= 0x1F232 && code !== 0x1F23B) // [13]
            )) ? ExtendedPictographic : None
        ) : code < 0x1F53E ? (
            // Miscellaneous Symbols and Pictographs
            (code >= 0x1F3FB && code <= 0x1F3FF)
                ? Extend | InCB_Extend | Emoji_Modifier : ExtendedPictographic // [5/752]
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
        )) ? ExtendedPictographic : None;
    }
    // Tags, Variation Selectors Supplement (E0000 - E01EF)
    if (code >= 0xE0000) {
        return code > 0xE0FFF ? None : (
            code >= 0xE01F0 // [3,600]
            || code <= 0xE001F // [32]
            || (code >= 0xE0080 && code <= 0xE00FF) // [128]
        ) ? Control : Extend | InCB_Extend; // [336]
    }
    return None;
}

/**
 * An approximation of whether a code point has the derived property `Grapheme_Base`.
 * The point is to be a quicker check than exaustively checking all code point ranges with the property,
 * since this check does not have to be super accurate.
 * The `Grapheme_Base` prop is derived from `[0..10FFFF] - Cc - Cf - Cs - Co - Cn - Zl - Zp - Grapheme_Extend`
 *
 * @remarks
 * This approximation returns false if the code point has the `Extend` grapheme break property,
 * (derived from {@link https://unicode.org/Public/16.0.0/ucd/auxiliary/GraphemeBreakProperty.txt})
 * with the exception of the 5 code points `1F3FB - 1F3FF5` that also have the `Emoji_Modifier` property
 * (derived from {@link https://unicode.org/Public/16.0.0/ucd/emoji/emoji-data.txt}).
 * Otherwise, returns false if the code point has a general category value of `Cf`, `Zl`, or `Zp`, derived from
 * {@link https://unicode.org/Public/16.0.0/ucd/extracted/DerivedGeneralCategory.txt}.
 *
 * @remarks
 * This implementation will not produce any false negatives (a response of `false` when the code point actually does
 * have the `Grapheme_Base` property), but it will produce false positives. All code points that produce
 * false positives will have a `General_Category` value of `Cn`, `Cs`, or `Co`.
 *
 * @param cp - code point to check
 * @param gbp - the grapheme break property of the code point
 * @returns `true` if the code point has the property `Grapheme_Base`, or `false` otherwise.
 */
export function isGraphemeBase(cp: number, gbp: number) {
    if ((gbp & 0xF) === Extend) {
        // code point has grapheme break property `Extend`
        return !!(gbp & Emoji_Modifier);
    }
    // otherwise, check for Cf, Zl, Zp
    // Basic Latin ... Hebrew (0000 - 05FF)
    if (cp < 0x0600) {
        return !(cp <= 0x009F
            ? (cp <= 0x001F || cp >= 0x007F) // Cc [65]
            : (cp === 0x00AD)); // Cf [1]
    }
    // Arabic ... Arabic Extended-A (0600 - 08FF)
    if (cp < 0x0900) {
        return !(cp < 0x0750 ? (
            // Arabic
            cp <= 0x0605 // Cf [6]
            || cp === 0x061C // Cf [1]
            || cp === 0x06DD // Cf [1]
            // Syriac
            || cp === 0x070F // Cf [1]
        ) : cp >= 0x0890 && (
            // Arabic Extended-B
            cp <= 0x0891 // Cf [2]
            // Arabic Extended-A
            || cp === 0x08E2 // Cf [1]
        ));
    }
    // Devanagari ... General Punctuation (0900 - 206F)
    if (cp < 0x2070) {
        return !(cp < 0x200B ? (
            // Mongolian
            cp === 0x180E // Cf [1]
        ) : (
            // General Punctuation
            cp <= 0x200F
            || (cp >= 0x2028 && cp <= 0x202E) // Zl [1] & Zp [1] & Cf [5]
            || cp >= 0x2060 // Cf [15] & Cn [1]
        ));
    }
    // Superscripts and Subscripts ... Specials (2070 - FFFB)
    if (cp <= 0xFFFB) {
        return !(
            // Arabic Presentation Forms-B
            cp === 0xFEFF // Cf [1]
            // Specials
            || cp >= 0xFFEF // Cn [10] + Cf [3]
        );
    }
    // Linear B Syllabary ... Musical Symbols (FFFC - 1D17A)
    if (cp <= 0x1D17A) {
        return !(cp < 0x13430 ? (
            // Kaithi
            cp === 0x110BD // Cf [1]
            || cp === 0x110CD // Cf [1]
        ) : cp < 0x1BCA0 ? (
            // Egyptian Hieroglyph Format Controls
            cp <= 0x1343F // Cf [16]
        ) : (
            // Shorthand Format Controls
            cp <= 0x1BCA3 // Cf [4]
            // Musical Symbols
            || cp >= 0x1D173 // Cf [8]
        ));
    }
    // Ancient Greek Musical Notation ... Supplementary Private Use Area-B (1D17B - 10FFFF)
    return !(cp >= 0x323B0 && cp <= 0xEFFFF && (
        // CJK Unified Ideographs Extension H
        cp <= 0xE001F // Cn [711,791] & Cf [1]
        // Variation Selectors Supplement
        || cp >= 0xE01F0 // Cn [65,040]
        // Tags
        || (cp >= 0xE0080 && cp <= 0xE00FF) // Cn [128]
    ));
}

/**
 * Determines if there is a cluster boundary between two grapheme cluster break property values
 *
 * @remarks
 * Rules are from {@link http://unicode.org/reports/tr29/#Grapheme_Cluster_Boundary_Rules}
 *
 * @param breakProps - grapheme break properties for characters preceeding `prev`
 * @param prev - grapheme break property of the previous character
 * @param next - grapheme break property of the next character
 * @returns Whether there is a cluster boundary between `prev` and `next`
 */
export function shouldBreak(breakProps: number[], prev: number, next: number) {
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

    // Do not break Hangul syllable or other conjoining sequences.

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
    if ((next & 0xF) === Extend || (next & 0xF) === ZWJ) {
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

    // Do not break within certain combinations with Indic_Conjunct_Break (InCB)=Linker.

    // GB9c: InCB_Consonant [InCB_Extend InCB_Linker]* InCB_Linker [InCB_Extend InCB_Linker]* × InCB_Consonant
    if (next & InCB_Consonant && prev & 0b0110000) {
        let linker = !!(prev & InCB_Linker);
        for (let i = breakProps.length - 1; i >= 0; i -= 1) {
            if (breakProps[i]! & InCB_Consonant) {
                if (linker) return false;
                break;
            }
            if (breakProps[i]! & 0b0110000) {
                linker ||= !!(breakProps[i]! & InCB_Linker);
                continue;
            }
            break;
        }
    }

    // Do not break within emoji modifier sequences or emoji zwj sequences.

    // GB11: ExtendedPictographic Extend* ZWJ × ExtendedPictographic
    if ((prev & 0xF) === ZWJ && next === ExtendedPictographic) {
        let i = breakProps.length - 1;
        while (((breakProps[i] ?? 0) & 0xF) === Extend) i -= 1;
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