const { emojiProps } = require('../lib/emoji'),
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