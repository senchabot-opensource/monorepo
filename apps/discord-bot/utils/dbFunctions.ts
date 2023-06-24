import { Guild } from "discord.js";
import { prisma } from "senchabot-prisma";

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
