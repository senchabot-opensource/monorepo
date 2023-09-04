import { IConfig, IGetAllConfig, ISetConfigInput } from "src/types";

export const getDefaultCmdList = async () => {
  const response = await fetch("/api/cmd", {
    method: "GET",
  });
  return response.json();
};

export const getFeatureList = async () => {
  const response = await fetch("/api/features", {
    method: "GET",
  });
  return response.json();
};

export const getCommandList = async () => {
  const response = await fetch("/api/cmd/list", {
    method: "GET",
  });
  return response.json();
};

export const getAliasList = async () => {
  const response = await fetch("/api/cmd/aliasList", {
    method: "GET",
  });
  return response.json();
};

export const deleteCommand = async (id: number) => {
  const response = await fetch("/api/cmd/delete", {
    method: "POST",
    body: id.toString(),
  });
  return response.json();
};

export const checkTwitchAccount = async () => {
  const response = await fetch("/api/twitch/findAccount", {
    method: "GET",
  });
  return response.json();
};

export const addTwitchAccount = async () => {
  const response = await fetch("/api/twitch/get-bot", {
    method: "POST",
  });
  return response.json();
};

export const getBotActivites = async () => {
  const response = await fetch("/api/bot/activity", {
    method: "GET",
  });
  return response.json();
};

export const getDiscordServerCount = async () => {
  const response = await fetch("/api/discord/getCount", {
    method: "GET",
  });
  return response.json();
};

export const getTwitchChannelCount = async () => {
  const response = await fetch("/api/twitch/getCount", {
    method: "GET",
  });
  return response.json();
};

export const getDiscordServers = async () => {
  const response = await fetch("/api/discord/getServerList", {
    method: "GET",
  });
  return response.json();
};

export const getTwitchChannels = async () => {
  const response = await fetch("/api/twitch/getChannelList", {
    method: "GET",
  });
  return response.json();
};

export const getAccount = async () => {
  const response = await fetch("/api/getAccount", {
    method: "GET",
  });
  return response.json();
};

export const deleteAccount = async () => {
  const response = await fetch("/api/deleteAccount", {
    method: "POST",
  });
  return response.json();
};

export const setConfig = async (input: ISetConfigInput) => {
  const response = await fetch("/api/config/setConfig", {
    method: "POST",
    body: JSON.stringify(input),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const getConfig = async () => {
  const response = await fetch("/api/config/getConfig", {
    method: "GET",
  });
  return response.json();
};

export const getAllConfig = async () => {
  const response = await fetch("/api/config/getAllConfig", {
    method: "GET",
  });
  return response.json();
};
