const wait = require("node:timers/promises").setTimeout;

const selectByIdCallback = (id) => (_) => _.id === id;

const selectByNameCallback = (name) => (_) => _.name === name;

module.exports = { wait, selectByIdCallback, selectByNameCallback };
