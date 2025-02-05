const fs = require('fs'),
    path = require('path'),
    https = require('https'),
    { render } = require('svg-term'),
    { optimize } = require('svgo'),
    { wordWrap, stripAnsi, ansiRegex } = require('..'),
    mediaFiles = require('../media/files');

const theme = {
    0: [0, 0, 0], // black
    1: [255, 92, 87], // red
    2: [90, 247, 142], // green
    3: [243, 249, 157], // yellow
    4: [87, 199, 255], // blue
    5: [215, 106, 255], // magenta
    6: [154, 237, 254], // cyan
    7: [241, 241, 240], // white
    8: [104, 104, 104], // light black
    9: [255, 92, 87], // light red
    10: [90, 247, 142], // light green
    11: [243, 249, 157], // light yellow
    12: [87, 199, 255], // light blue
    13: [215, 106, 255], // light magenta
    14: [154, 237, 254], // light cyan
    15: [241, 241, 240], // light white
    background: [40, 42, 54],
    bold: [248, 248, 248],
    cursor: [234, 234, 234],
    text: [239, 240, 235],
    fontFamily: 'Fira Code',
};

/**
 * Make a GET request
 * @param {string} url
 * @returns {Promise<Object>}
 */
function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {
            const chunks = [];
            // handle response chunks
            resp.on('data', (chunk) => {
                chunks.push(chunk);
            });
            // response complete
            resp.on('end', () => {
                const { 'content-type': type } = resp.headers,
                    data = Buffer.concat(chunks);
                resolve({ type, data });
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

function hasBoldStyling(string) {
    let i = 0,
        boldActive = false;
    for (let regex = ansiRegex(), m = regex.exec(string); m; m = regex.exec(string)) {
        const { 0: seq, index: j } = m;
        if (j > i && boldActive) return true;
        i = j + seq.length;
        const [, code] = /[\u001B\u009B]\[(\d+)(?:;\d+)*m/.exec(seq) ?? [];
        if (!code) continue;
        const n = Number(code);
        if (n === 1) boldActive = true;
        else if (n === 0 || n === 22) boldActive = false;
    }
    return (i < string.length && boldActive);
}

/**
 * Fetch the required css code for a chunk of text
 * @param {string} string - the text the font will apply to
 * @param {string} fontFamily - the name of the font to use
 * @returns {Promise<string>} - css code
 */
async function fetchFontCss(string, fontFamily) {
    // determine character subset
    const charSubset = [...new Set([...stripAnsi(string).replace(/[\n\r]/g, '')])]
            .filter((c) => c.codePointAt(0) < 0x20FF)
            .sort()
            .join(''),
        // create google fonts url
        cssUrl = `https://fonts.googleapis.com/css2?family=${
            fontFamily.replace(' ', '+')
        }:wght@400${
            hasBoldStyling(string) ? ';700' : ''
        }&text=${encodeURI(charSubset)}`;
    // fetch css from google api
    let { data: css } = await fetchData(cssUrl);
    css = css.toString();
    // find all font urls in css code
    const regex = /url\((https?:\/\/.+?)\)/g,
        urls = [];
    for (let m = regex.exec(css); m; m = regex.exec(css)) {
        const { 0: str, 1: url, index } = m;
        urls.push([index + str.indexOf(url), url]);
    }
    // return css with font urls replace with base64 encoded versions
    return urls.reduce((p, [j, url], idx) => p.then(async ([i, str]) => {
        const { type, data } = await fetchData(url),
            base64 = `data:${type};charset=utf-8;base64,${data.toString('base64')}`,
            j2 = j + url.length;
        return (idx === urls.length - 1)
            ? str + css.slice(i, j) + base64 + css.slice(j2)
            : [j2, str + css.slice(i, j) + base64];
    }), Promise.resolve([0, '']));
}

/**
 * Render a screencast
 * @param {string} string - content displayed in the terminal
 * @param {number} width - width of the terminal window
 * @returns {Promise<string>} - screencast svg
 */
async function renderScreencast(string, width) {
    // height of the terminal
    const height = string.split('\n').length + 1;
    // fetch font css from the google fonts api
    let fontCss;
    try {
        fontCss = await fetchFontCss(string, theme.fontFamily);
    } catch (e) {
        console.log(`Error occured fetching google font:\n${e.message}`);
        return null;
    }
    // an asciicast v2 file with one event frame
    const asciicast = [
        `{"version": 2, "width": ${width}, "height": ${height}}`,
        `[0.5, "o", ${JSON.stringify(string).replace(/\\n/g, '\\r\\n')}]`,
    ].join('\n');
    // render terminal svg using `svg-term`
    let svg = render(asciicast, {
        theme,
        at: 1000,
        cursor: false,
        to: null,
        from: null,
        window: true,
        paddingX: 5,
        paddingY: 5,
        width,
        height,
    });
    // inject google font css <style> tag into svg
    svg = svg.replace(/^(<svg.*?>)/, `$1<defs><style type="text/css">${fontCss}</style></defs>`);
    // optimize with svgo
    ({ data: svg } = optimize(svg, { inlineStyles: false }));
    // returned optimized svg string
    return svg;
}

async function run() {
    // render all screencast svg media files
    await mediaFiles.reduce((p, {
        id,
        input,
        width,
        options,
    }) => p.then(async () => {
        const filePath = path.resolve(__dirname, `../media/${id}.svg`);
        console.log(`rendering screencast '${id}' to '${path.relative(process.cwd(), filePath)}`);
        const wrapped = wordWrap(input, width, options),
            svg = await renderScreencast(wrapped, width);
        fs.writeFileSync(filePath, svg);
    }), Promise.resolve());
}

run();