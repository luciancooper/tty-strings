/* eslint-disable no-restricted-syntax */
const parseAnsi = require('./parseAnsi'),
    { styleCodes, closingCodes } = require('./ansiCodes'),
    charWidths = require('./charWidths'),
    stringWidth = require('./stringWidth');

function closeAnsiStack(ansiStack, ax, ay) {
    const stack = ansiStack.filter(([,,, x, y]) => (x < ax || (x === ax && y <= ay)));
    let escapes = '';
    while (stack.length) {
        const [, isLink, close] = stack.pop();
        escapes += isLink ? close : `\u001B[${close}m`;
        // remove all other escapes in the stack that this escape closes to prevent duplicates
        for (let i = stack.length - 1; i >= 0; i -= 1) {
            const [, l, c] = stack[i];
            if (isLink ? l : (close === 0 || close === c)) {
                stack.splice(i, 1);
            }
        }
    }
    return escapes;
}

function parseEscape(ansiStack, seq, ix, iy, ax, ay) {
    // eslint-disable-next-line no-control-regex
    const { 1: code, 2: link } = seq.match(/[\u001B\u009B](?:\[(\d+)(?:;\d+)*m|\]8;;(.*)\u0007)/) || {};
    // bitmask indicating what has been closed by this sequence
    let closeMask = 0;
    // update ansi escape stack
    if (code) {
        const n = Number(code);
        if (closingCodes.includes(n)) {
            // remove all escapes that this sequence closes from the stack
            for (let i = ansiStack.length - 1; i >= 0; i -= 1) {
                const [, isLink, close, x, y] = ansiStack[i];
                // if item is a link or is not closed by this code, skip it
                if (isLink || (n !== 0 && close !== n)) continue;
                // update close info bitmask
                if (x < ax || (x === ax && y <= ay)) closeMask |= 1; // bits 001
                if (x < ix) closeMask |= 6; // bits 110
                else if (y <= ay) closeMask |= 4; // bits 100
                // remove style sequence from the stack
                ansiStack.splice(i, 1);
            }
        } else {
            // add this ansi escape to the stack
            ansiStack.push([seq, false, styleCodes.get(n) || 0, ix, iy]);
        }
    } else if (link !== undefined) {
        // if link is an empty string, then this is a closing hyperlink sequence
        if (!link.length) {
            // remove all hyperlink escapes from the stack
            for (let i = ansiStack.length - 1; i >= 0; i -= 1) {
                const [, isLink,, x, y] = ansiStack[i];
                // if item is not an open hyperlink, skip it
                if (!isLink) continue;
                // update close info bitmask
                if (x < ax || (x === ax && y <= ay)) closeMask |= 1; // bits 001
                if (x < ix) closeMask |= 6; // bits 110
                else if (y <= ay) closeMask |= 4; // bits 100
                // remove open hyperlink sequence from the stack
                ansiStack.splice(i, 1);
            }
        } else {
            // add this hyperlink escape to the stack
            ansiStack.push([seq, true, '\u001B]8;;\u0007', ix, iy]);
        }
    }
    // return close info bitmask
    return closeMask;
}

function wrapLine(string, columns, hard, ltrim) {
    if (string.trim() === '') return '';
    // array to store each wrapped row as it is processed
    const rows = [],
        // ansi escapes stack, with items in the form [seq, isLink, close, ix, iy]
        ansiStack = [];
    // the current row
    let row = '',
        // the current row length
        rl = 0,
        // word index of the active point in the ansi stack
        ax = -1,
        // intraword index of the active point in the ansi stack
        ay = 0,
        // preserved space
        space = '',
        // trimmed space
        trimmed = '';
    // split the input string into words and measure each one
    const words = string.split(' ').map((word) => [word, stringWidth(word)]);
    // loop through each word
    words.forEach(([word, len], ix) => {
        // if this is not the first word
        if (ix > 0) {
            // increment the length of the current row if a space must be added before this word
            if (rl > 0 || (!ltrim && ax < 0)) rl += 1;
            // update accumulated space
            space += ' ';
        }
        // if hard wrap mode is enabled, words whose length exceeds `columns` must be wrapped across multiple rows
        if (hard && (len > columns || (!ltrim && ax < 0 && rl + len > columns && rl < columns))) {
            // determine if a linebreak should occur before this hard wrapped word (adapted from `wrap-ansi`)
            const rc = (columns - rl),
                // compare the row span if hard wrapped word starts on the next line vs the current line
                brkNext = Math.floor((len - 1) / columns) < (1 + Math.floor((len - rc - 1) / columns));
            // check if word should break starting on the next row
            if (brkNext && !(!ltrim && ax < 0)) {
                // finalize the current row
                rows.push(row + trimmed + closeAnsiStack(ansiStack, ax, ay));
                // start a new row
                [rl, row] = [0, ''];
                // clear preserved & trimmed space
                [space, trimmed] = ['', ''];
            }
            // location within the current word
            let iy = 0;
            // match all ansi escape codes in this word
            for (const [chunk, isEscape] of parseAnsi(word)) {
                // check if chunk is an escape sequence
                if (isEscape) {
                    // parse the matched ansi escape sequence
                    const closed = parseEscape(ansiStack, chunk, ix, iy, ax, ay);
                    if (ax < ix) {
                        // check if sequence closes an active escape in the current row
                        if (closed & 1) trimmed += chunk;
                        // check if sequence closes an active escape in the current row or preserved space
                        if (closed & 2) space += chunk;
                    } else if (rl && (closed & 4)) {
                        // sequence closes a currently active escape
                        row += chunk;
                    }
                    continue;
                }
                // store our current location within this word at the outset of this chunk
                const sy = iy;
                // see if the word index of the active point in the ansi stack needs to be updated
                if (ax < ix) {
                    // check for edge case where large leading whitespace forces a line break before the first word
                    if (!ltrim && ax < 0 && rl === columns) {
                        // complete the current row of preserved leading whitespace
                        rows.push(row + space + closeAnsiStack(ansiStack, ix, -1));
                        // start a new row
                        [rl, row] = [0, ''];
                    }
                    row += rl
                        // non-empty row - append preserved space & any escape sequences opened within this word
                        ? space + ansiStack.filter(([,,, x]) => x === ix).map(([s]) => s).join('')
                        // row is empty - initialize it with all active escape sequences
                        : ansiStack.map(([s]) => s).join('');
                    // set the active point in the ansi stack to the beginning of the current word
                    [ax, ay] = [ix, 0];
                    // clear preserved & trimmed space
                    [space, trimmed] = ['', ''];
                }
                // loop through the characters in this chunk
                for (const [char, w] of charWidths(chunk)) {
                    // check if a line break is needed
                    if (rl + w > columns) {
                        // finalize the current row
                        rows.push(row + closeAnsiStack(ansiStack, ax, ay));
                        // initialize a new row with all currently active escape sequences
                        [rl, row] = [0, ansiStack.map(([s]) => s).join('')];
                    }
                    // see if the intra-word index of the active point in the ansi stack needs to be updated
                    if (ay < sy) {
                        // if row is not empty, add all new escape sequences from the ansi stack
                        if (rl) {
                            row += ansiStack
                                .filter(([,,, x, y]) => (x === ax && ay < y))
                                .map(([s]) => s).join('');
                        }
                        // update the active point in the ansi stack to the beginning of the current chunk
                        ay = sy;
                    }
                    // add this character to the current row & update the row length
                    row += char;
                    rl += w;
                    // increment current location within this word
                    iy += w;
                }
            }
            return;
        }
        // index location within the current word
        let iy = 0;
        // match all ansi escape codes in this word
        for (const [chunk, isEscape] of parseAnsi(word)) {
            // check if chunk is an escape sequence
            if (isEscape) {
                // parse the matched ansi escape sequence
                const closed = parseEscape(ansiStack, chunk, ix, iy, ax, ay);
                if (ax < ix) {
                    // check if sequence closes an active escape in the current row
                    if (closed & 1) trimmed += chunk;
                    // check if sequence closes an active escape in the current row or preserved space
                    if (closed & 2) space += chunk;
                } else if (rl && (closed & 4)) {
                    // sequence closes a currently active escape
                    row += chunk;
                }
                continue;
            }
            // see if the word index of the active point in the ansi stack needs to be updated
            if (ax < ix) {
                // check if there should be a line break before this word
                if ((!ltrim && ax < 0) ? (rl === columns) : (rl + len > columns && rl > 0)) {
                    // finalize the current row
                    rows.push(
                        (!ltrim && ax < 0)
                            // row of preserved leading whitespace
                            ? row + space + closeAnsiStack(ansiStack, ix, -1)
                            // normal row
                            : row + trimmed + closeAnsiStack(ansiStack, ax, ay),
                    );
                    // start a new row
                    [rl, row] = [0, ''];
                }
                row += rl
                    // non-empty row - append preserved space & any escape sequences opened within this word
                    ? space + ansiStack.filter(([,,, x]) => x === ix).map(([s]) => s).join('')
                    // row is empty - initialize it with all active escape sequences
                    : ansiStack.map(([s]) => s).join('');
                // add the length of this word to the current row length
                rl += len;
                // set the active point in the ansi stack to the beginning of the current word
                [ax, ay] = [ix, 0];
                // clear preserved & trimmed space
                [space, trimmed] = ['', ''];
            }
            // see if the intra-word index of the active point in the ansi stack needs to be updated
            if (ay < iy) {
                // add any new opening escapes to the current row (rl will always be > 0 here)
                row += ansiStack.filter(([,,, x, y]) => (x === ax && ay < y)).map(([s]) => s).join('');
                // update the active point in the ansi stack to the beginning of the current chunk
                ay = iy;
            }
            // add this chunk to the current row
            row += chunk;
            // update current location within this word
            iy += chunk.length;
        }
        // check for edge case where large leading whitespace forces a line break before the first word
        if (!ltrim && ax < 0 && rl === columns) {
            // complete the current row of preserved leading whitespace
            rows.push(row + space + closeAnsiStack(ansiStack, ix, -1));
            // start a new row
            [rl, row] = [0, ''];
            // reset space with all currently active escapes prior to this word index
            space = ansiStack.filter(([,,, x]) => x < ix).map(([s]) => s).join('');
            // clear trimmed space
            trimmed = '';
        }
        // update preserved space with any escape sequences found at the end of this word
        space += ansiStack.filter(([,,, x, y]) => (x === ix && (ax < ix || ay < y))).map(([s]) => s).join('');
    });
    // finalize the last row if necessary
    if (rl > 0) rows.push(row + trimmed + closeAnsiStack(ansiStack, ax, ay));
    // return wrapped rows
    return ax >= 0 ? rows.join('\n') : '';
}

/**
 * Word wrap a string to a specified column width. By default, words that are longer than the specified
 * column width will not be broken and will therefore extend past the specified column width. If hard wrapping
 * is enabled, words longer than the column width will be broken and wrapped across multiple rows.
 * @param {string} string - input text to wrap
 * @param {number} columns - width to wrap the text to
 * @param {Object} [options]
 * @param {boolean} [options.hard=false] - enable hard wrap mode
 * @param {boolean} [options.trimLeft=true] - trim leading whitespace from each wrapped line
 * @returns {string}
 */
module.exports = function wordWrap(string, columns, { hard = false, trimLeft = true } = {}) {
    return String(string)
        // normlize unicode
        .normalize('NFC')
        // normalizes newlines
        .replace(/\r\n/g, '\n')
        // split into lines
        .split('\n')
        // wrap each line
        .map((line) => wrapLine(line, columns, hard, trimLeft))
        // rejoin each wrapped line
        .join('\n');
};