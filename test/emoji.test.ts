import { emojiProps, isEmojiZwjSequence, isEmojiModifierSequence } from '../src/emoji';
import { fetchUnicodeFile, reduceRanges, selectFixtures } from './unicodeHelpers';

describe('emojiProps', () => {
    let fixtures: [number, number][];

    beforeAll(async () => {
        // fetch the emoji-data.txt unicode data file
        let fetched: [number, number, ...string[]][];
        try {
            fetched = await fetchUnicodeFile('UCD/latest/ucd/emoji/emoji-data.txt', true);
        } catch (e) {
            throw new Error(`Failed to fetch emoji property data:\n\n${(e as { message: string }).message}`);
        }
        // filter out Extended_Pictographic ranges
        fetched = fetched.filter(([,, prop]) => prop !== 'Extended_Pictographic');
        // convert each property to a mask value
        let props = fetched.map<[number, number, number]>(([r1, r2, prop]) => {
            switch (prop) {
                case 'Emoji': return [r1, r2, 1];
                case 'Emoji_Presentation': return [r1, r2, 1 << 1]; // 2
                case 'Emoji_Modifier_Base': return [r1, r2, 1 << 2]; // 4
                case 'Emoji_Modifier': return [r1, r2, 1 << 3]; // 8
                case 'Emoji_Component': return [r1, r2, 1 << 4]; // 16
                default: return [r1, r2, 0];
            }
        }).flatMap<[number, number]>(([r1, r2, mask]) => {
            // deconstruct all ranges into single elements
            const items: [number, number][] = [];
            for (let c = r1; c <= r2; c += 1) items.push([c, mask]);
            return items;
        });
        // sort items
        props = props.sort(([a], [b]) => a - b);
        // merge code point masks
        {
            let i = 0;
            while (i < props.length - 1) {
                const [e1, e2] = [props[i]!, props[i + 1]!];
                if (e1[0] === e2[0]) {
                    e1[1] |= e2[1];
                    props.splice(i + 1, 1);
                } else i += 1;
            }
        }
        // filter out unwanted code points
        props = props.filter(([cp, m]) => (cp >= 0x2070 && !(cp >= 0x1F1E6 && cp <= 0x1F1FF) && (m & 1)));
        // turn code points back into ranges, reduce, and select fixtures
        fixtures = selectFixtures(reduceRanges(props.map(([cp, mask]) => [cp, cp, mask])), 0);
    });

    test('emoji property mask values', () => {
        expect(fixtures.map(([cp, mask]) => [cp, emojiProps(cp), mask])).toMatchEachCodePoint();
    });
});

describe('isEmojiModifierSequence', () => {
    let modifierSequences: [number, number][];

    beforeAll(async () => {
        // fetch the emoji-sequences.txt unicode data file
        let data: string[];
        try {
            data = await fetchUnicodeFile('emoji/latest/emoji-sequences.txt', false, 2);
        } catch (e) {
            throw new Error(`Failed to fetch emoji sequence data:\n\n${(e as { message: string }).message}`);
        }
        // parse each sequence
        modifierSequences = [];
        for (const l of data) {
            const [seq, type] = l.split(/\s*;\s*/g) as [string, string];
            // include only sequences with the `RGI_Emoji_Modifier_Sequence` property
            if (type === 'RGI_Emoji_Modifier_Sequence') {
                modifierSequences.push(seq.split(' ').map((s) => parseInt(s, 16)) as [number, number]);
            }
        }
    });

    test('passes RGI emoji modifier sequences', () => {
        expect(modifierSequences.map((seq) => [seq, isEmojiModifierSequence(...seq)])).toMatchEachSequence(true);
    });
});

describe('isEmojiZwjSequence', () => {
    let zwjFullyQualified: number[][],
        zwjMinimallyQualified: number[][],
        zwjUnqualified: number[][];

    beforeAll(async () => {
        // fetch the emoji-test.txt unicode data file
        let fetched: string[];
        try {
            fetched = await fetchUnicodeFile('emoji/latest/emoji-test.txt', false);
        } catch (e) {
            throw new Error(`Failed to fetch emoji test data:\n\n${(e as { message: string }).message}`);
        }
        // parse the test data
        const data: [number[], string][] = [];
        for (const l of fetched) {
            const [seq, type] = l.split(/\s*;\s*/g),
                // split the sequence and parse each code point
                cp = seq!.split(' ').map((s) => parseInt(s, 16));
            // include only zwj sequences
            if (cp.length > 1 && cp.includes(0x200D)) {
                data.push([cp, type!]);
            }
        }
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