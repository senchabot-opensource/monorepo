const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pongs."),
  async execute(interaction) {
    await interaction.reply({
      content: "pong",
      ephemeral: true, // Geçici mesaj. Mesajı sadece komutu çalıştıran kullanıcıya gösterir
    });
  },
};
