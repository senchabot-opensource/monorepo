import { CommandInteraction } from "discord.js";

const { SlashCommandBuilder } = require("@discordjs/builders");

export default {
  data: new SlashCommandBuilder()
    .setName("astra")
    .setDescription("Astra UI Kit"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: "[We did it!] Astra UI Kit: https://docs.astraui.com",
    });
  },
};
