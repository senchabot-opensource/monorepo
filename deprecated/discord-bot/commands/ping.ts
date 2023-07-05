import { CommandInteraction } from "discord.js";

const { SlashCommandBuilder } = require("@discordjs/builders");

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pongs."),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: "pong",
      ephemeral: true, // Geçici mesaj. Mesajı sadece komutu çalıştıran kullanıcıya gösterir
    });
  },
};
