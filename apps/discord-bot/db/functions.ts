import { Guild } from "discord.js";
import { prisma } from "./client";

export const addDiscordServerToDB = async (guild: Guild) => {
  const findServer = await findDiscordServer(guild);

  if (findServer) return;

  await prisma.discordServer.create({
    data: {
      serverId: guild.id,
      serverName: guild.name,
      serverOwner: guild.ownerId,
    },
  });
};

export const deleteDiscordServerFromDB = async (guild: Guild) => {
  const findServer = await findDiscordServer(guild);
  await prisma.discordServer.delete({
    where: {
      id: findServer?.id,
    },
  });
};

const findDiscordServer = async (guild: Guild) => {
  const foundServer = await prisma.discordServer.findFirst({
    where: { serverId: guild.id },
  });

  return foundServer;
};

interface IFindAnnouncementChannelParams {
  channelId: string;
  serverId: string;
}

export const findAnnouncementChannel = async (
  params: IFindAnnouncementChannelParams,
) => {
  const foundAnnouncementChannel =
    await prisma.discordAnnouncementChannels.findFirst({
      where: params,
    });

  return foundAnnouncementChannel;
};

interface IAddAnnouncementChannelParams {
  channelId: string;
  serverId: string;
  createdBy: string;
}

export const addAnnouncementChannel = async (
  params: IAddAnnouncementChannelParams,
) => {
  await prisma.discordAnnouncementChannels.create({
    data: params,
  });
};

export const getAnnouncementChannels = async () => {
  const annChannels = await prisma.discordAnnouncementChannels.findMany();
  return annChannels;
};

interface IAddBotActivityParams {
  botPlatformType: string;
  botActivity: string;
  discordServerId: string | null;
  activityAuthor: string | null;
}

export const addBotActivity = async (params: IAddBotActivityParams) => {
  await prisma.botActionActivities.create({
    data: params,
  });
};
