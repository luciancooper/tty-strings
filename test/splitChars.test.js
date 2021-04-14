const { splitChars } = require('..');

describe('splitChars', () => {
    test('handles zero-length strings', () => {
        expect(splitChars('')).toStrictEqual([]);
    });

    test('handles non-string inputs', () => {
        expect(splitChars(10)).toStrictEqual([]);
    });

    test('splits plain strings', () => {
        expect(splitChars('foo')).toStrictEqual(['f', 'o', 'o']);
    });

    test('does not split between a carriage return & line feed', () => {
        expect(splitChars('a\r\nb')).toStrictEqual(['a', '\r\n', 'b']);
    });

    test('splits strings with combining diacritical marks', () => {
        expect(splitChars('Ĺo͂řȩm̅')).toStrictEqual(['Ĺ', 'o͂', 'ř', 'ȩ', 'm̅']);
    });

    test('splits hindi strings with combining marks', () => {
        expect(splitChars('अनुच्छेद')).toStrictEqual(['अ', 'नु', 'च्', 'छे', 'द']);
    });

    test('splits hangul syllables', () => {
        expect(splitChars('뎌쉐련쩨뼕')).toStrictEqual(['뎌', '쉐', '련', '쩨', '뼕']);
    });

    test('splits emoji sequences', () => {
        expect(splitChars('🌷🎁💩😜👍🇺🇸🇬🇷🏳️‍🌈')).toStrictEqual(['🌷', '🎁', '💩', '😜', '👍', '🇺🇸', '🇬🇷', '🏳️‍🌈']);
    });
});