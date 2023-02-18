export const wait = require("node:timers/promises").setTimeout;

export const selectByIdCallback = (id: string | undefined) => (_: any) =>
  _.id === id;

export const selectByNameCallback = (name: string | undefined) => (_: any) =>
  _.name === name;
