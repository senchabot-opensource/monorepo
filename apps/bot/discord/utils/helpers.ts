export const wait = require("node:timers/promises").setTimeout;

export const selectByIdCallback = (id: string | undefined) => (_: any) =>
  _.id === id;

export const selectByNameCallback = (name: string | undefined) => (_: any) =>
  _.name === name;

export const getURL = (domain: string, messageContent: string) => {
  const msgLen = messageContent.length;
  let url: string = "";

  if (messageContent.includes(domain)) {
    const urlStartIndex = messageContent.indexOf(domain);

    const stringFromURLStart = messageContent.substring(urlStartIndex, msgLen);

    const searchSpaceIndex = stringFromURLStart.substring(
      0,
      stringFromURLStart.indexOf(" ")
    );

    if (searchSpaceIndex) {
      url = searchSpaceIndex;
    } else {
      url = stringFromURLStart;
    }
  }

  const httpProtocol = "https://";

  url = httpProtocol + url;

  return url;
};
