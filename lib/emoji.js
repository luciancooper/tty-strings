/**
 * Get the emoji properties of a given unicode code point
 * Returns a bitmask encoded with the following properties:
 * `Emoji (1) | Emoji_Presentation (2) | Emoji_Modifier_Base (4) | Emoji_Modifier (8) | Emoji_Component (16)`
 * Properties are derived from {@link https://unicode.org/Public/13.0.0/ucd/emoji/emoji-data.txt}
 * @param {number} code - unicode code point
 * @returns {number}
 */
function emojiProps(code) {
    // Basic Latin ... Miscellaneous Symbols and Arrows (0000 - 2BFF)
    if (code < 0x2C00) {
        return code < 0x231A ? (
            (code >= 0x2122 && (code < 0x2194 ? (
                // Letterlike Symbols
                code === 0x2122 // [1]
                || code === 0x2139 // [1]
            ) : (
                // Arrows
                code <= 0x2199 // [6]
                || (code >= 0x21A9 && code <= 0x21AA) // [2]
            ))) ? 1 : 0
        ) : code < 0x23FB ? (
            // Miscellaneous Technical
            code < 0x23E9 ? (
                code <= 0x231B ? 3 // [2]
                    : (code === 0x2328 || code === 0x23CF) ? 1 : 0 // [2]
            ) : code <= 0x23F3 ? (
                (code <= 0x23EC || code === 0x23F0 || code === 0x23F3) ? 3 : 1 // [6 / 5]
            ) : code >= 0x23F8 ? 1 : 0 // [3]
        ) : code < 0x2600 ? (
            code < 0x25FB ? ((
                code <= 0x25AB ? (
                    // Enclosed Alphanumerics
                    code === 0x24C2 // [1]
                    // Geometric Shapes
                    || code >= 0x25AA // [2]
                ) : (code === 0x25B6 || code === 0x25C0) // [2]
            ) ? 1 : 0) : code <= 0x25FE ? (
                code <= 0x25FC ? 1 : 3 // [2 / 2]
            ) : 0
        ) : code < 0x2620 ? (
            // Miscellaneous Symbols
            code < 0x2614 ? (
                (code <= 0x2604 || code === 0x260E || code === 0x2611) ? 1 : 0 // [7]
            ) : code <= 0x2615 ? 3 // [2]
                : code === 0x2618 ? 1 // [1]
                    : code === 0x261D ? 5 : 0 // [1]
        ) : code < 0x2648 ? (
            (code <= 0x262F ? (
                (code <= 0x2623 && code !== 0x2621) // [3]
                || code === 0x2626 // [1]
                || code === 0x262A // [1]
                || code >= 0x262E // [2]
            ) : (code >= 0x2638 && (
                code <= 0x263A // [3]
                || code === 0x2640 // [1]
                || code === 0x2642 // [1]
            ))) ? 1 : 0
        ) : code < 0x2694 ? (
            code <= 0x2668 ? (
                (code >= 0x265F && (
                    code <= 0x2660 // [2]
                    || (code >= 0x2663 && code !== 0x2664 && code !== 0x2667) // [4]
                )) ? 1 : code <= 0x2653 ? 3 : 0 // [12]
            ) : (code === 0x267B || code === 0x267E || code === 0x2692) ? 1 // [3]
                : (code === 0x267F || code === 0x2693) ? 3 : 0 // [2]
        ) : code < 0x26C6 ? (
            code < 0x26AA ? (
                code === 0x26A1 ? 3 : (
                    (code <= 0x269C && code !== 0x2698 && code !== 0x269A) // [7]
                    || code === 0x26A0 // [1]
                    || code === 0x26A7 // [1]
                ) ? 1 : 0
            ) : code <= 0x26B1 ? (
                code <= 0x26AB ? 3 // [2]
                    : code >= 0x26B0 ? 1 : 0 // [2]
            ) : (code >= 0x26BD && code <= 0x26C5 && (
                code <= 0x26BE // [2]
                || code >= 0x26C4 // [2]
            )) ? 3 : 0
        ) : code < 0x2700 ? (
            code < 0x26F0 ? (
                code <= 0x26D1 ? (
                    (code === 0x26C8 || code === 0x26CF || code === 0x26D1) ? 1 // [3]
                        : code === 0x26CE ? 3 : 0 // [1]
                ) : (code === 0x26D3 || code === 0x26E9) ? 1 // [2]
                    : (code === 0x26D4 || code === 0x26EA) ? 3 : 0 // [2]
            ) : code <= 0x26F8 ? (
                code <= 0x26F5
                    ? ((code <= 0x26F1 || code === 0x26F4) ? 1 : 3) // [3 / 3]
                    : code >= 0x26F7 ? 1 : 0 // [2]
            ) : (code === 0x26FA || code === 0x26FD) ? 3 // [2]
                : code === 0x26F9 ? 5 : 0 // [1]
        ) : code < 0x270E ? (
            // Dingbats
            code < 0x2708 ? (
                code === 0x2702 ? 1 // [1]
                    : code === 0x2705 ? 3 : 0 // [1]
            ) : code >= 0x270C ? 5 // [2]
                : code >= 0x270A ? 7 : 1 // [2 / 2]
        ) : code < 0x2733 ? (
            code <= 0x2721 ? ((
                code === 0x270F // [1]
                || code === 0x2712 // [1]
                || code === 0x2714 // [1]
                || code === 0x2716 // [1]
                || code === 0x271D // [1]
                || code === 0x2721 // [1]
            ) ? 1 : 0) : (
                code === 0x2728 ? 3 : 0 // [1]
            )
        ) : code < 0x2758 ? (
            code < 0x274C ? ((
                code <= 0x2734 // [2]
                || code === 0x2744 // [1]
                || code === 0x2747 // [1]
            ) ? 1 : 0) : (
                (code <= 0x274E && code !== 0x274D) // [2]
                || (code >= 0x2753 && code !== 0x2756) // [4]
            ) ? 3 : 0
        ) : code < 0x27C0 ? (
            code <= 0x2797 ? (
                code >= 0x2795 ? 3 // [3]
                    : (code >= 0x2763 && code <= 0x2764) ? 1 : 0 // [2]
            ) : (code === 0x27B0 || code === 0x27BF) ? 3 // [2]
                : code === 0x27A1 ? 1 : 0 // [1]
        ) : (
            code <= 0x2B07 ? (
                (code >= 0x2934 && (
                    // Supplemental Arrows-B
                    code <= 0x2935 // [2]
                    // Miscellaneous Symbols and Arrows
                    || code >= 0x2B05 // [3]
                )) ? 1 : 0
            ) : (code >= 0x2B1B && (
                code <= 0x2B1C // [2]
                || code === 0x2B50 // [1]
                || code === 0x2B55 // [1]
            )) ? 3 : 0
        );
    }
    // Glagolitic ... Ornamental Dingbats (2C00 - 1F67F)
    if (code < 0x1F680) {
        return code < 0x1F170 ? (
            code <= 0x3299 ? ((
                // CJK Symbols and Punctuation
                code === 0x3030 // [1]
                || code === 0x303D // [1]
                // Enclosed CJK Letters and Months
                || (code >= 0x3297 && code !== 0x3298) // [2]
            ) ? 1 : 0) : (
                // Mahjong Tiles
                code === 0x1F004 // [1]
                // Playing Cards
                || code === 0x1F0CF // [1]
            ) ? 3 : 0
        ) : code < 0x1F19B ? (
            // Enclosed Alphanumeric Supplement
            code <= 0x1F17F ? ((
                code <= 0x1F171 // [2]
                || code >= 0x1F17E // [2]
            ) ? 1 : 0) : (
                code === 0x1F18E // [1]
                || code >= 0x1F191 // [10]
            ) ? 3 : 0
        ) : code < 0x1F300 ? (
            // Enclosed Ideographic Supplement
            code < 0x1F232 ? (
                (code === 0x1F201 || code === 0x1F21A || code === 0x1F22F) ? 3 // [3]
                    : code === 0x1F202 ? 1 : 0 // [1]
            ) : code <= 0x1F251 ? (
                code === 0x1F237 ? 1 // [1]
                    : (code <= 0x1F23A || code >= 0x1F250) ? 3 : 0 // [10]
            ) : 0
        ) : code < 0x1F3A0 ? (
            // Miscellaneous Symbols and Pictographs
            code < 0x1F324 ? (
                code <= 0x1F320 ? 3 // [33]
                    : code === 0x1F321 ? 1 : 0 // [1]
            ) : code < 0x1F37E ? (
                (code <= 0x1F32C || code === 0x1F336 || code === 0x1F37D) ? 1 : 3 // [11 / 79]
            ) : code <= 0x1F393 ? (
                code === 0x1F385 ? 7 : 3 // [1 / 21]
            ) : (code >= 0x1F396 && (
                (code <= 0x1F39B && code !== 0x1F398) // [5]
                || code >= 0x1F39E // [2]
            )) ? 1 : 0
        ) : code < 0x1F3F8 ? (
            code < 0x1F3CB ? (
                ((code >= 0x1F3C2 && code <= 0x1F3C4) || code === 0x1F3C7 || code === 0x1F3CA) ? 7 : 3 // [5 / 38]
            ) : code < 0x1F3CF ? (
                code <= 0x1F3CC ? 5 : 1 // [2 / 2]
            ) : code <= 0x1F3F0 ? (
                (code <= 0x1F3D3 || code >= 0x1F3E0) ? 3 : 1 // [22 / 12]
            ) : code === 0x1F3F4 ? 3 // [1]
                : (code >= 0x1F3F3 && code !== 0x1F3F6) ? 1 : 0 // [3]
        ) : code < 0x1F4FE ? (
            code <= 0x1F43E ? (
                (code >= 0x1F3FB && code <= 0x1F3FF) ? 27 : 3 // [5 / 66]
            ) : code < 0x1F442 ? (
                code === 0x1F440 ? 3 : 1 // [1 / 2]
            ) : code < 0x1F466 ? (
                ((code >= 0x1F444 && code <= 0x1F445) || code >= 0x1F451) ? 3 : 7 // [23 / 13]
            ) : code < 0x1F481 ? (
                (code <= 0x1F478 || code === 0x1F47C) ? 7 : 3 // [20 / 7]
            ) : code < 0x1F488 ? (
                code === 0x1F484 ? 3 : 7 // [1 / 6]
            ) : code <= 0x1F4FC ? (
                (code === 0x1F48F || code === 0x1F491 || code === 0x1F4AA) ? 7 : 3 // [3 / 114]
            ) : 1 // [1]
        ) : code < 0x1F57A ? (
            code <= 0x1F54A ? (
                (code >= 0x1F4FF && code <= 0x1F53D) ? 3 // [63]
                    : code >= 0x1F549 ? 1 : 0 // [2]
            ) : code < 0x1F56F ? (
                (code <= 0x1F567 && code !== 0x1F54F) ? 3 : 0 // [28]
            ) : (code >= 0x1F574 && code <= 0x1F575) ? 5 // [2]
                : (code <= 0x1F570 || code >= 0x1F573) ? 1 : 0 // [7]
        ) : code < 0x1F5A5 ? (
            code <= 0x1F58D ? (
                (code >= 0x1F58A || code === 0x1F587) ? 1 // [5]
                    : code === 0x1F57A ? 7 : 0 // [1]
            ) : code < 0x1F595 ? (
                code === 0x1F590 ? 5 : 0 // [1]
            ) : code <= 0x1F596 ? 7 // [2]
                : code === 0x1F5A4 ? 3 : 0 // [1]
        ) : code < 0x1F5FB ? (
            (code <= 0x1F5C4 ? (
                code === 0x1F5A5 // [1]
                || code === 0x1F5A8 // [1]
                || (code >= 0x1F5B1 && code <= 0x1F5B2) // [2]
                || code === 0x1F5BC // [1]
                || (code >= 0x1F5C2 && code <= 0x1F5C4) // [3]
            ) : code <= 0x1F5E3 ? (
                (code >= 0x1F5D1 && code <= 0x1F5D3) // [3]
                || (code >= 0x1F5DC && code <= 0x1F5DE) // [3]
                || (code >= 0x1F5E1 && code !== 0x1F5E2) // [2]
            ) : (
                code === 0x1F5E8 // [1]
                || code === 0x1F5EF // [1]
                || code === 0x1F5F3 // [1]
                || code === 0x1F5FA // [1]
            )) ? 1 : 0
        ) : code <= 0x1F64F ? (
            // Emoticons
            (code <= 0x1F644 || (code >= 0x1F648 && code <= 0x1F64A)) ? 3 : 7 // [77 / 8]
        ) : 0;
    }
    // Transport and Map Symbols ... Supplementary Private Use Area-B (1F680 - 10FFFF)
    return code < 0x1F6D0 ? (
        // Transport and Map Symbols
        code < 0x1F6B4 ? (
            code === 0x1F6A3 ? 7 : 3 // [1 / 51]
        ) : code <= 0x1F6C5 ? (
            (code <= 0x1F6B6 || code === 0x1F6C0) ? 7 : 3 // [4 / 14]
        ) : code >= 0x1F6CB ? (
            code === 0x1F6CC ? 7 : 1 // [1 / 4]
        ) : 0
    ) : code < 0x1F6FD ? (
        code < 0x1F6E0 ? (
            (code <= 0x1F6D2 || code >= 0x1F6DC || (code >= 0x1F6D5 && code <= 0x1F6D7)) ? 3 : 0 // [10]
        ) : code < 0x1F6EB ? (
            (code <= 0x1F6E5 || code === 0x1F6E9) ? 1 : 0 // [7]
        ) : (code <= 0x1F6EC || code >= 0x1F6F4) ? 3 // [11]
            : (code === 0x1F6F0 || code === 0x1F6F3) ? 1 : 0 // [2]
    ) : code < 0x1F93F ? (
        code < 0x1F90C ? (
            // Geometric Shapes Extended
            ((code >= 0x1F7E0 && code <= 0x1F7EB) || code === 0x1F7F0) ? 3 : 0 // [13]
        ) : code <= 0x1F91F ? (
            // Supplemental Symbols and Pictographs
            (code >= 0x1F918 || code === 0x1F90C || code === 0x1F90F) ? 7 : 3 // [10 / 10]
        ) : code <= 0x1F92F ? (
            code === 0x1F926 ? 7 : 3 // [1 / 15]
        ) : code === 0x1F93A ? 3 // [1]
            : code !== 0x1F93B ? 7 : 0 // [13]
    ) : code < 0x1F9B0 ? (
        code === 0x1F977 ? 7 // [1]
            : code !== 0x1F946 ? 3 : 0 // [111]
    ) : code <= 0x1F9FF ? (
        code <= 0x1F9B9 ? (
            code <= 0x1F9B3 ? 19 // [4]
                : (code === 0x1F9B4 || code === 0x1F9B7) ? 3 : 7 // [2 / 4]
        ) : code <= 0x1F9CC ? (
            code === 0x1F9BB ? 7 : 3 // [1 / 18]
        ) : (code === 0x1F9D0 || code >= 0x1F9DE) ? 3 : 7 // [35 / 16]
    ) : code <= 0x1FAC2 ? ((
        // Symbols and Pictographs Extended-A
        (code >= 0x1FA70 && code <= 0x1FA7C) // [13]
        || (code >= 0x1FA80 && code <= 0x1FA88) // [9]
        || (code >= 0x1FA90 && code <= 0x1FABD) // [46]
        || code >= 0x1FABF // [4]
    ) ? 3 : 0) : code <= 0x1FAF8 ? (
        (code <= 0x1FAC5 || code >= 0x1FAF0) ? 7
            : ((code >= 0x1FACE && code <= 0x1FADB) || (code >= 0x1FAE0 && code <= 0x1FAE8)) ? 3 : 0 // [23]
    ) : 0;
}

function nextZwj(sequence, idx) {
    const j = sequence.indexOf(0x200D, idx);
    return j < 0 ? sequence.length : j;
}

/**
 * Check if a sequence of code points is an emoji zwj sequence. Returns `true` for fully-qualified and
 * minimally-qualified emoji zwj sequences, and `false` for unqualified sequences
 * Emoji zwj sequences defined by UTS #51 ED-16: {@link https://unicode.org/reports/tr51/#def_emoji_zwj_sequence}
 * Emoji zwj elements defined by UTS #51 ED-15a: {@link https://unicode.org/reports/tr51/#def_emoji_zwj_element}
 * @param {number[]} sequence - array of code points
 * @returns {boolean}
 */
function isEmojiZwjSequence(sequence) {
    // lower index of the current zwj sequence element
    let i = 0,
        // find first zero width joiner
        j = nextZwj(sequence, i),
        // extract first zwj sequence element
        seq = sequence.slice(i, j);
    // rgi emoji zwj sequence components are never more than 2 code points
    if (seq.length > 2) return false;
    // destructure code points in the first zwj sequence element
    let [cp1, cp2] = seq,
        // get emoji props for first code point
        props1 = emojiProps(cp1),
        // track if the whole sequence must be fully qualified
        fullyQualified = false;
    // check if first zwj sequence element is a single code point
    if (cp2 === undefined) {
        // code point must have the `Emoji_Presentation` property
        if (!(props1 & 2)) return false;
    } else if (cp2 === 0xFE0F) {
        // emoji presentation sequence: first code point must be `Emoji` but not have `Emoji_Presentation`
        if ((props1 & 3) !== 1) return false;
        // rest of the sequence must be fully qualified
        fullyQualified = true;
    } else {
        // get the emoji props for the second code point
        const props2 = emojiProps(cp2);
        // check for a valid emoji modifier sequence: `Emoji_Modifier_Base` followed by `Emoji_Modifier`
        if (!((props1 & 4) && (props2 & 8))) return false;
    }
    // find all subsequent emoji zwj sequences
    for (i = j + 1; i < sequence.length; i = j + 1) {
        // find next zero width joiner
        j = nextZwj(sequence, i);
        // extract next zwj sequence element
        seq = sequence.slice(i, j);
        // rgi emoji zwj sequence components are never more than 2 code points
        if (seq.length > 2) return false;
        // destructure code points in this zwj sequence element
        [cp1, cp2] = seq;
        // get emoji props for first code point
        props1 = emojiProps(cp1);
        // check if seq is a single code point
        if (cp2 === undefined) {
            // accept any `Emoji`
            if ((props1 & 1) === 0) return false;
        } else if (cp2 === 0xFE0F) {
            // second code point is an emoji presentation selector, if element must be fully qualified,
            // first code point must be `Emoji` but not have `Emoji_Presentation`, otherwise, accept any `Emoji`
            if (!(fullyQualified ? (props1 & 3) === 1 : (props1 & 1))) return false;
        } else {
            // get the emoji props for the second code point
            const props2 = emojiProps(cp2);
            // check for a valid emoji modifier sequence: `Emoji_Modifier_Base` followed by `Emoji_Modifier`
            if (!((props1 & 4) && (props2 & 8))) return false;
        }
    }
    return true;
}

/**
 * Check if two code points make a valid emoji modifier sequence
 * Defined by UTS #51 ED-13: {@link https://unicode.org/reports/tr51/#def_emoji_modifier_sequence}
 * @param {number} cp1 - first code point
 * @param {number} cp2 - second code point
 * @returns {boolean}
 */
function isEmojiModifierSequence(cp1, cp2) {
    // get emoji props for both code points
    const props1 = emojiProps(cp1),
        props2 = emojiProps(cp2);
    // a valid emoji modifier sequence must be an `Emoji_Modifier_Base` followed by an `Emoji_Modifier`
    return !!((props1 & 4) && (props2 & 8));
}

module.exports = {
    emojiProps,
    isEmojiZwjSequence,
    isEmojiModifierSequence,
};