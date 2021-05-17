// eslint-disable-next-line import/no-extraneous-dependencies
const chalk = require('chalk');

module.exports = [{
    id: 'word-wrap',
    input: `The ${chalk.bgGreen.magenta('quick brown 🦊 jumps over')} the 😴 🐶.`,
    width: 20,
}];