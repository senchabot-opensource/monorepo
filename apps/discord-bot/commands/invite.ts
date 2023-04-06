import { CommandInteraction } from "discord.js";
import { env } from "../utils/env";

const { SlashCommandBuilder } = require("@discordjs/builders");

export default {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Senchabot invite url."),
  execute(interaction: CommandInteraction) {
    const client_id = env.CLIENTID;
    const permissions = 2199022698327;
    const url = `https://discord.com/api/oauth2/authorize?client_id=${client_id}&permissions=${permissions}&scope=bot%20applications.commands`;

    interaction.reply({ content: url, ephemeral: true });
  },
};
