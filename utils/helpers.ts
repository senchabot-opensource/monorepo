export const wait = require("node:timers/promises").setTimeout;

export const selectByIdCallback = (id: string) => (_: any) => _.id === id;

export const selectByNameCallback = (name: string) => (_: any) =>
  _.name === name;
