import { Interaction } from "discord.js";
import { IDiscordClient } from "../client";
import { addBotActivity } from "../db/functions";

export default {
  name: "interactionCreate",
  async execute(
    interaction: Interaction & {
      client: IDiscordClient;
    },
  ) {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.execute(interaction);
      addBotActivity({
        botPlatformType: "discord",
        botActivity: "/" + interaction.commandName,
        discordServerId: interaction.guildId,
        activityAuthor: interaction.user.username,
      });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: "There was an error", ephemeral: true });
    }
  },
};
