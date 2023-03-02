const { emojiProps, isEmojiZwjSequence, isEmojiModifierSequence } = require('../lib/emoji'),
    { fetchUnicodeFile, reduceRanges, selectFixtures } = require('./unicodeHelpers');

describe('emojiProps', () => {
    let fixtures;

    beforeAll(async () => {
        // fetch the emoji-data.txt unicode data file
        let props;
        try {
            props = await fetchUnicodeFile('UCD/latest/ucd/emoji/emoji-data.txt', true);
        } catch (e) {
            throw new Error(`Failed to fetch emoji property data:\n\n${e.message}`);
        }
        // filter out Extended_Pictographic ranges
        props = props.filter(([,, prop]) => prop !== 'Extended_Pictographic');
        // convert each property to a mask value
        props = props.map(([r1, r2, prop]) => {
            switch (prop) {
                case 'Emoji': return [r1, r2, 1];
                case 'Emoji_Presentation': return [r1, r2, 1 << 1]; // 2
                case 'Emoji_Modifier_Base': return [r1, r2, 1 << 2]; // 4
                case 'Emoji_Modifier': return [r1, r2, 1 << 3]; // 8
                case 'Emoji_Component': return [r1, r2, 1 << 4]; // 16
                default: return [r1, r2, 0];
            }
        });
        // deconstruct all ranges into single elements
        props = props.flatMap(([r1, r2, mask]) => {
            const items = [];
            for (let c = r1; c <= r2; c += 1) items.push([c, mask]);
            return items;
        });
        // sort items
        props = props.sort(([a], [b]) => a - b);
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
        expect(fixtures.map(([cp, mask]) => [cp, emojiProps(cp), mask])).toMatchEachCodePoint();
    });
});

describe('isEmojiModifierSequence', () => {
    let modifierSequences;

    beforeAll(async () => {
        // fetch the emoji-sequences.txt unicode data file
        let data;
        try {
            data = await fetchUnicodeFile('emoji/latest/emoji-sequences.txt');
        } catch (e) {
            throw new Error(`Failed to fetch emoji sequence data:\n\n${e.message}`);
        }
        // parse each sequence
        modifierSequences = data.map((l) => {
            const [seq, type] = l.split(/\s*;\s*/g);
            // include only sequences with the `RGI_Emoji_Modifier_Sequence` property
            return type === 'RGI_Emoji_Modifier_Sequence' ? seq.split(' ').map((s) => parseInt(s, 16)) : null;
        }).filter(Boolean);
    });

    test('passes RGI emoji modifier sequences', () => {
        expect(modifierSequences.map((seq) => [seq, isEmojiModifierSequence(...seq)])).toMatchEachSequence(true);
    });
});

describe('isEmojiZwjSequence', () => {
    let zwjFullyQualified,
        zwjMinimallyQualified,
        zwjUnqualified;

    beforeAll(async () => {
        // fetch the emoji-test.txt unicode data file
        let data;
        try {
            data = await fetchUnicodeFile('emoji/latest/emoji-test.txt');
        } catch (e) {
            throw new Error(`Failed to fetch emoji test data:\n\n${e.message}`);
        }
        // parse the test data
        data = data.map((l) => {
            let [seq, type] = l.split(/\s*;\s*/g);
            // split the sequence and parse each code point
            seq = seq.split(' ').map((s) => parseInt(s, 16));
            // include only zwj sequences
            return (seq.length > 1 && seq.includes(0x200D)) ? [seq, type] : null;
        }).filter(Boolean);
        // create array of `fully-qualified` zwj sequences
        zwjFullyQualified = data.filter(([, type]) => type === 'fully-qualified').map(([seq]) => seq);
        // create array of `minimally-qualified` zwj sequences
        zwjMinimallyQualified = data.filter(([, type]) => type === 'minimally-qualified').map(([seq]) => seq);
        // create array of `unqualified` zwj sequences
        zwjUnqualified = data.filter(([, type]) => type === 'unqualified').map(([seq]) => seq);
    });

    test('passes fully-qualified emoji zwj sequences', () => {
        expect(zwjFullyQualified.map((seq) => [seq, isEmojiZwjSequence(seq)])).toMatchEachSequence(true);
    });

    test('passes minimally-qualified emoji zwj sequences', () => {
        expect(zwjMinimallyQualified.map((seq) => [seq, isEmojiZwjSequence(seq)])).toMatchEachSequence(true);
    });

    test('rejects unqualified emoji zwj sequences', () => {
        expect(zwjUnqualified.map((seq) => [seq, isEmojiZwjSequence(seq)])).toMatchEachSequence(false);
    });
});