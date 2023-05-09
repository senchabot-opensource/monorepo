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
  ];
  const commandAliases = [
    {
      commandAlias: "h",
      commandName: "help",
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

    const createdCommand = await prisma.botCommands.create({
      data: {
        commandName: command.commandName,
        commandContent: command.commandContent,
        twitchChannelId: command.twitchChannelId,
        createdBy: "Senchabot",
      },
    });

    for (const alias of commandAliases) {
      await prisma.botCommandAliases.create({
        data: {
          commandAlias: alias.commandAlias,
          commandName: createdCommand.commandName,
          twitchChannelId: createdCommand.twitchChannelId,
          createdBy: "Senchabot",
        },
      });
    }
  }
}
