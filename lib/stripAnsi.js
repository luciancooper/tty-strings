const ansiRegex = require('ansi-regex');

const regex = ansiRegex();

/**
 * Strip ansi escape sequences from a sring
 * @param {string} string
 * @returns {string}
 */
module.exports = function stripAnsi(string) {
    return (typeof string === 'string') ? string.replace(regex, '') : String(string);
};