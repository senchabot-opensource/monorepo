import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Fill this variable with your logged Twitch account id
  const twitchId = "";

  addCommandsAndAliases(twitchId);
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

async function addCommandsAndAliases(twitchChannelId: string) {
  const commands = [
    {
      commandName: "help",
      commandContent: "help command",
      twitchChannelId: twitchChannelId,
    },
    {
      commandName: "hello",
      commandContent: "hello",
      twitchChannelId: twitchChannelId,
    },
  ];
  const commandAliases = [
    {
      commandAlias: "h",
      commandName: "help",
      twitchChannelId: twitchChannelId,
    },
    {
      commandAlias: "l",
      commandName: "lurk",
      twitchChannelId: twitchChannelId,
    },
    {
      commandAlias: "lurking",
      commandName: "lurk",
      twitchChannelId: twitchChannelId,
    },
    {
      commandAlias: "hi",
      commandName: "hello",
      twitchChannelId: twitchChannelId,
    },
  ];

  for (const command of commands) {
    const findCommand = await prisma.botCommands.findFirst({
      where: {
        commandName: command.commandName,
        twitchChannelId: command.twitchChannelId,
      },
    });

    if (findCommand) return;

    await prisma.botCommands.create({
      data: {
        commandName: command.commandName,
        commandContent: command.commandContent,
        twitchChannelId: command.twitchChannelId,
        createdBy: "Senchabot",
      },
    });
  }

  for (const alias of commandAliases) {
    const findAlias = await prisma.botCommandAliases.findFirst({
      where: {
        commandAlias: alias.commandAlias,
        twitchChannelId: alias.twitchChannelId,
      },
    });

    if (findAlias) return;

    await prisma.botCommandAliases.create({
      data: {
        commandAlias: alias.commandAlias,
        commandName: alias.commandName,
        twitchChannelId: twitchChannelId,
        createdBy: "Senchabot",
      },
    });
  }

  const botActionActivities = [
    {
      botPlatformType: "twitch",
      botActivity: "!lurk",
      twitchChannelId: twitchChannelId,
      activityAuthor: "Senchabot",
    },
    {
      botPlatformType: "twitch",
      botActivity: "Clear chat",
      twitchChannelId: twitchChannelId,
      activityAuthor: "Senchabot",
    },
    {
      botPlatformType: "twitch",
      botActivity: "Scheduled message: blabla",
      twitchChannelId: twitchChannelId,
      activityAuthor: "Senchabot",
    },
  ];

  for (const activity of botActionActivities) {
    await prisma.botActionActivities.create({
      data: {
        botPlatformType: activity.botPlatformType,
        botActivity: activity.botActivity,
        botPlatformId: twitchChannelId,
        activityAuthor: activity.activityAuthor,
      },
    });
  }
}
