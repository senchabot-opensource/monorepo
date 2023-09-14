import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AccountId {
  providerAccountId: string;
}

async function main() {
  const twitchAccount: AccountId | null = await prisma.account.findFirst({
    where: {
      provider: "twitch",
    },
    select: {
      providerAccountId: true,
    },
  });

  const discordAccount: AccountId | null = await prisma.account.findFirst({
    where: {
      provider: "discord",
    },
    select: {
      providerAccountId: true,
    },
  });

  const discordServerId = await prisma.discordServer.findFirst({
    select: {
      serverId: true,
    },
  });

  const twitchChannelId = await prisma.twitchChannel.findFirst({
    select: {
      channelId: true,
    },
  });

  if (twitchAccount && !twitchChannelId && discordAccount && !discordServerId) {
    const twitchAccountId = twitchAccount?.providerAccountId || null;
    const discordUserId = discordAccount?.providerAccountId || null;

    twitchDataCreate(twitchAccountId);
    discordDataCreate(discordUserId);
  } else if (discordAccount && !discordServerId) {
    const discordUserId = discordAccount?.providerAccountId || null;

    discordDataCreate(discordUserId);
  } else if (twitchAccount && !twitchChannelId) {
    const twitchAccountId = twitchAccount?.providerAccountId || null;

    twitchDataCreate(twitchAccountId);
  } else if (!twitchAccount && !discordAccount) {
    console.log("-------------------------------------------------------");
    console.log("Please login any platform on http://localhost:3000/app");
    console.log("-------------------------------------------------------");
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const discordDataCreate = async (discordUserId: string | null) => {
  if (discordUserId) {
    await prisma.discordServer.create({
      data: {
        serverId: "12345",
        serverName: "Senchabot",
        serverOwner: discordUserId,
      },
    });
  }

  const discordServerId = await prisma.discordServer.findFirst({
    select: {
      serverId: true,
    },
  });

  const botActionActivities = [
    {
      botPlatformType: "discord",
      botActivity: "/sukru",
      discordServerId: discordServerId?.serverId,
      activityAuthor: "Senchabot",
    },
    {
      botPlatformType: "discord",
      botActivity: "/help",
      discordServerId: discordServerId?.serverId,
      activityAuthor: "Senchabot",
    },
    {
      botPlatformType: "discord",
      botActivity: "Streamer deleted",
      discordServerId: discordServerId?.serverId,
      activityAuthor: "Senchabot",
    },
  ];

  for (const activity of botActionActivities) {
    await prisma.botActionActivities.create({
      data: {
        botPlatformType: activity.botPlatformType,
        botActivity: activity.botActivity,
        botPlatformId: activity.discordServerId,
        activityAuthor: activity.activityAuthor,
      },
    });
  }
};

const twitchDataCreate = async (twitchAccountId: string | null) => {
  if (twitchAccountId) {
    await prisma.twitchChannel.create({
      data: {
        channelId: twitchAccountId,
        channelName: "Senchabot",
      },
    });
  }

  const commands = [
    {
      commandName: "help",
      commandContent: "help command",
      twitchChannelId: twitchAccountId,
    },
    {
      commandName: "hello",
      commandContent: "hello",
      twitchChannelId: twitchAccountId,
    },
    {
      commandName: "ping",
      commandContent: "pong",
      twitchChannelId: twitchAccountId,
    },
    {
      commandName: "go",
      commandContent: "lets goooooo",
      twitchChannelId: twitchAccountId,
    },
    {
      commandName: "lurk",
      commandContent: "lurk",
      twitchChannelId: twitchAccountId,
    },
  ];
  const commandAliases = [
    {
      commandAlias: "h",
      commandName: "help",
      twitchChannelId: twitchAccountId,
    },
    {
      commandAlias: "l",
      commandName: "lurk",
      twitchChannelId: twitchAccountId,
    },
    {
      commandAlias: "lurking",
      commandName: "lurk",
      twitchChannelId: twitchAccountId,
    },
    {
      commandAlias: "hi",
      commandName: "hello",
      twitchChannelId: twitchAccountId,
    },
  ];

  for (const command of commands) {
    const findCommand = await prisma.botCommands.findFirst({
      where: {
        commandName: command.commandName,
        twitchChannelId: twitchAccountId,
      },
    });

    if (findCommand) return;

    await prisma.botCommands.create({
      data: {
        commandName: command.commandName,
        commandContent: command.commandContent,
        twitchChannelId: twitchAccountId,
        createdBy: "Senchabot",
      },
    });
  }

  for (const alias of commandAliases) {
    const findAlias = await prisma.botCommandAliases.findFirst({
      where: {
        commandAlias: alias.commandAlias,
        twitchChannelId: twitchAccountId,
      },
    });

    if (findAlias) return;

    await prisma.botCommandAliases.create({
      data: {
        commandAlias: alias.commandAlias,
        commandName: alias.commandName,
        twitchChannelId: twitchAccountId,
        createdBy: "Senchabot",
      },
    });
  }

  const botActionActivities = [
    {
      botPlatformType: "twitch",
      botActivity: "!lurk",
      twitchAccountId: twitchAccountId,
      activityAuthor: "Senchabot",
    },
    {
      botPlatformType: "twitch",
      botActivity: "Clear chat",
      twitchAccountId: twitchAccountId,
      activityAuthor: "Senchabot",
    },
    {
      botPlatformType: "twitch",
      botActivity: "Scheduled message: blabla",
      twitchAccountId: twitchAccountId,
      activityAuthor: "Senchabot",
    },
  ];

  for (const activity of botActionActivities) {
    await prisma.botActionActivities.create({
      data: {
        botPlatformType: activity.botPlatformType,
        botActivity: activity.botActivity,
        botPlatformId: activity.twitchAccountId,
        activityAuthor: activity.activityAuthor,
      },
    });
  }
};
