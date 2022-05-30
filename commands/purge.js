const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { checkBotPermission } = require("../utils/botFunctions");
const { wait } = require("../utils/helpers");
const { checkMemberPermission } = require("../utils/memberFunctions");

const manageMessagesPermFlag = Permissions.FLAGS.MANAGE_MESSAGES;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription(
      "Find and delete the last 100 messages that contain the specified character string."
    )
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription(
          "Find and delete messages that contain this character string in their content."
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription(
          "Find and delete messages sent by the username or nickname that contain this character string."
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    //console.log(interaction);
    const guild = interaction.member.guild;

    if (
      !checkMemberPermission(
        interaction.memberPermissions,
        manageMessagesPermFlag
      ) ||
      !checkBotPermission(guild, manageMessagesPermFlag)
    )
      return;

    const channelMessages = guild.channels.cache.get(
      interaction.channel.id
    ).messages;

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
      .then((messages) => {
        messages.map((message) => {
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
      ephemeral: true,
    });
  },
};
