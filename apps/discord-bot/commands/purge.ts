import {
  ChatInputCommandInteraction,
  Collection,
  Guild,
  Message,
  MessageManager,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import checkBotPermission from "../utils/botFunctions";
import { wait } from "../utils/helpers";
import { checkMemberPermission } from "../utils/memberFunctions";

const manageMessagesPermFlag = PermissionFlagsBits.ManageMessages;

export default {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription(
      "Find and delete the last 100 messages that contain the specified character string."
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("content")
        .setDescription(
          "Find and delete messages that contain this character string in their content."
        )
        .setRequired(false)
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("username")
        .setDescription(
          "Find and delete messages sent by the username or nickname that contain this character string."
        )
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;

    if (
      !checkMemberPermission(
        interaction.memberPermissions,
        manageMessagesPermFlag
      )
    ) {
      console.log(
        `MEMBER "${interaction.member?.user.username}" DOES NOT HAVE "MANAGE MESSAGES" PERMISSION.`
      );
      return;
    }

    if (!checkBotPermission(guild, manageMessagesPermFlag)) {
      console.log('BOT DOES NOT HAVE "MANAGE MESSAGES" PERMISSION.');
      return;
    }

    const channelMessages = interaction.channel?.messages as MessageManager;

    const wordString = interaction.options.getString("content");
    const usernameString = interaction.options.getString("username");

    if (!wordString && !usernameString) {
      await interaction.reply({
        content: "One of the content or username information must be filled.",
        ephemeral: true,
      });
      return;
    }

    channelMessages
      .fetch({ limit: 100 })
      .then((messages: Collection<string, Message>) => {
        messages.map((message: Message) => {
          if (wordString) {
            if (message.content.toLowerCase().includes(wordString)) {
              channelMessages.delete(message);
              wait(100);
            }
          }

          if (usernameString) {
            if (
              guild.members.cache
                .get(message.author.id)
                ?.nickname?.toLowerCase()
                .includes(usernameString.toLowerCase()) ||
              message.author.username
                .toLowerCase()
                .includes(usernameString.toLowerCase())
            ) {
              channelMessages.delete(message);
              wait(100);
            }
          }
        });
      })
      .catch(console.error);

    await interaction.deferReply({
      ephemeral: true,
    });

    await interaction.editReply({
      content: `Messages ${
        wordString
          ? "that contain the ``" +
            wordString +
            "`` character string will be deleted."
          : ""
      } ${
        usernameString
          ? "sent by the username or nickname that contain the ``" +
            usernameString +
            "`` character string will be deleted."
          : ""
      } `,
    });
  },
};
