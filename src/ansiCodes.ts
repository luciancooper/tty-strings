/**
 * A map of ansi SGR styles to their closing codes.
 *
 * @remarks
 * Derived from {@link https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters}
 * as well as {@link https://github.com/mintty/mintty/wiki/Tips#text-attributes-and-rendering}
 *
 */
export const styleCodes = new Map([
    ['1', '22'], // bold
    ['2', '22'], // dim
    ['3', '23'], // italic
    ['4', '24'], // underline single
    ['4:', '4:0'], // underline with params
    ['5', '25'], // slow blink
    ['6', '25'], // rapid blink
    ['7', '27'], // inverse
    ['8', '28'], // hidden
    ['9', '29'], // strikethrough
    ['20', '23'], // blackletter font
    ['21', '24'], // double underline
    ['26', '50'], // proportional spacing
    ['30', '39'], // foreground black
    ['31', '39'], // foreground red
    ['32', '39'], // foreground green
    ['33', '39'], // foreground yellow
    ['34', '39'], // foreground blue
    ['35', '39'], // foreground magenta
    ['36', '39'], // foreground cyan
    ['37', '39'], // foreground white
    ['38', '39'], // 8 bit / 24 bit foreground color
    ['90', '39'], // foreground bright black
    ['91', '39'], // foreground bright red
    ['92', '39'], // foreground bright green
    ['93', '39'], // foreground bright yellow
    ['94', '39'], // foreground bright blue
    ['95', '39'], // foreground bright magenta
    ['96', '39'], // foreground bright cyan
    ['97', '39'], // foreground bright white
    ['40', '49'], // background black
    ['41', '49'], // background red
    ['42', '49'], // background green
    ['43', '49'], // background yellow
    ['44', '49'], // background blue
    ['45', '49'], // background magenta
    ['46', '49'], // background cyan
    ['47', '49'], // background white
    ['48', '49'], // 8 bit / 24 bit background color
    ['51', '54'], // framed
    ['52', '54'], // encircled
    ['53', '55'], // overline
    ['58', '59'], // underline color
    ['60', '65'], // ideogram underline
    ['61', '65'], // ideogram double underline
    ['62', '65'], // ideogram overline
    ['63', '65'], // ideogram double overline
    ['64', '65'], // ideogram stress marking
    ['73', '75'], // superscript
    ['74', '75'], // subscript
    ['100', '49'], // background bright black
    ['101', '49'], // background bright red
    ['102', '49'], // background bright green
    ['103', '49'], // background bright yellow
    ['104', '49'], // background bright blue
    ['105', '49'], // background bright magenta
    ['106', '49'], // background bright cyan
    ['107', '49'], // background bright white
]);

/**
 * An array of closing codes
 */
export const closingCodes = [
    '0', // reset
    '4:0', // underline off
    '22', // normal intensity (not bold or dim)
    '23', // not italic
    '24', // not underlined
    '25', // not blinking
    '27', // not reversed
    '28', // not hidden
    '29', // not strikethrough
    '39', // default foreground
    '49', // default background
    '50', // disable proportional spacing
    '54', // not framed nor encircled
    '55', // not overlined
    '59', // default underline color
    '65', // no ideogram attributes
    '75', // not superscript nor subscript
];