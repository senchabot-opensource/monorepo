import { CommandInteraction } from "discord.js";

const { SlashCommandBuilder } = require("@discordjs/builders");

export default {
  data: new SlashCommandBuilder()
    .setName("sukru")
    .setDescription("sukru the command"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content:
        "https://github.com/dotnet/runtime/pull/73499/files#diff-31c708307a9d9c09e7e488a873803e62bfcc91a8d3fa6d9398d3c8bb13cff1afR338",
    });
  },
};
