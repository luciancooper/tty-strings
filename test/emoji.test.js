const { emojiProps, isEmojiZwjSequence, isEmojiModifierSequence } = require('../lib/emoji'),
    { fetchUnicodeFile, reduceRanges, selectFixtures } = require('./unicodeHelpers');

describe('emojiProps', () => {
    let fixtures;

    beforeAll(async () => {
        // fetch and parse the emoji-data.txt unicode data file
        let props = (await fetchUnicodeFile('UCD/latest/ucd/emoji/emoji-data.txt', true))
            // filter out Extended_Pictographic ranges
            .filter(([,, prop]) => prop !== 'Extended_Pictographic')
            // convert each property to a mask value
            .map(([r1, r2, prop]) => {
                switch (prop) {
                    case 'Emoji': return [r1, r2, 1];
                    case 'Emoji_Presentation': return [r1, r2, 1 << 1]; // 2
                    case 'Emoji_Modifier_Base': return [r1, r2, 1 << 2]; // 4
                    case 'Emoji_Modifier': return [r1, r2, 1 << 3]; // 8
                    case 'Emoji_Component': return [r1, r2, 1 << 4]; // 16
                    default: return [r1, r2, 0];
                }
            })
            // deconstruct all ranges into single elements
            .flatMap(([r1, r2, mask]) => {
                const items = [];
                for (let c = r1; c <= r2; c += 1) items.push([c, mask]);
                return items;
            })
            // sort items
            .sort(([a], [b]) => a - b);
        // merge code point masks
        {
            let i = 0;
            while (i < props.length - 1) {
                const [e1, e2] = [props[i], props[i + 1]];
                if (e1[0] === e2[0]) {
                    e1[1] |= e2[1];
                    props.splice(i + 1, 1);
                } else i += 1;
            }
        }
        // filter out unwanted code points
        props = props.filter(([cp, m]) => (cp >= 0x2070 && !(cp >= 0x1F1E6 && cp <= 0x1F1FF) && (m & 1)));
        // turn code points back into ranges & reduce
        props = reduceRanges(props.map(([cp, mask]) => [cp, cp, mask]));
        // select code point fixtures
        fixtures = selectFixtures(props, 0);
    });

    test('emoji property mask values', () => {
        for (let i = 0, n = fixtures.length; i < n; i += 1) {
            const [cp, mask] = fixtures[i];
            expect(emojiProps(cp)).toBe(mask);
        }
    });
});

describe('isEmojiModifierSequence', () => {
    let modifierSequences;

    beforeAll(async () => {
        // fetch and parse the emoji-sequences.txt unicode data file
        modifierSequences = (await fetchUnicodeFile('emoji/latest/emoji-sequences.txt')).map((l) => {
            const [seq, type] = l.split(/\s*;\s*/g);
            // include only sequences with the `RGI_Emoji_Modifier_Sequence` property
            return type === 'RGI_Emoji_Modifier_Sequence' ? seq.split(' ').map((s) => parseInt(s, 16)) : null;
        }).filter(Boolean);
    });

    test('passes RGI emoji modifier sequences', () => {
        for (let i = 0, n = modifierSequences.length; i < n; i += 1) {
            const [cp1, cp2] = modifierSequences[i];
            expect(isEmojiModifierSequence(cp1, cp2)).toBe(true);
        }
    });
});

describe('isEmojiZwjSequence', () => {
    let zwjFullyQualified,
        zwjMinimallyQualified,
        zwjUnqualified;

    beforeAll(async () => {
        // fetch and parse the emoji-test.txt unicode data file
        const zwjTests = (await fetchUnicodeFile('emoji/latest/emoji-test.txt')).map((l) => {
            let [seq, type] = l.split(/\s*;\s*/g);
            // split the sequence and parse each code point
            seq = seq.split(' ').map((s) => parseInt(s, 16));
            // include only zwj sequences
            return (seq.length > 1 && seq.includes(0x200D)) ? [seq, type] : null;
        }).filter(Boolean);
        // create array of `fully-qualified` zwj sequences
        zwjFullyQualified = zwjTests.filter(([, type]) => type === 'fully-qualified').map(([seq]) => seq);
        // create array of `minimally-qualified` zwj sequences
        zwjMinimallyQualified = zwjTests.filter(([, type]) => type === 'minimally-qualified').map(([seq]) => seq);
        // create array of `unqualified` zwj sequences
        zwjUnqualified = zwjTests.filter(([, type]) => type === 'unqualified').map(([seq]) => seq);
    });

    test('passes fully-qualified emoji zwj sequences', () => {
        for (let i = 0, n = zwjFullyQualified.length; i < n; i += 1) {
            const seq = zwjFullyQualified[i];
            expect(isEmojiZwjSequence(seq)).toBe(true);
        }
    });

    test('passes minimally-qualified emoji zwj sequences', () => {
        for (let i = 0, n = zwjMinimallyQualified.length; i < n; i += 1) {
            const seq = zwjMinimallyQualified[i];
            expect(isEmojiZwjSequence(seq)).toBe(true);
        }
    });

    test('rejects unqualified emoji zwj sequences', () => {
        for (let i = 0, n = zwjUnqualified.length; i < n; i += 1) {
            const seq = zwjUnqualified[i];
            expect(isEmojiZwjSequence(seq)).toBe(false);
        }
    });
});