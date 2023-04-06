import {
  ChatInputCommandInteraction,
  Guild,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { checkMemberPermission } from "../utils/memberFunctions";

const manageEventsPermFlag = PermissionFlagsBits.ManageEvents;

const purgeCommand = new SlashCommandSubcommandBuilder()
  .setName("purge")
  .setDescription("Purge scheduled guild events");

export default {
  data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Manage guild events")
    .addSubcommand(purgeCommand)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;

    if (
      !checkMemberPermission(
        interaction.memberPermissions,
        manageEventsPermFlag
      )
    ) {
      console.log(
        `MEMBER "${interaction.member?.user.username}" DOES NOT HAVE "MANAGE EVENTS" PERMISSION.`
      );
      return;
    }

    if (interaction.options.getSubcommand() === "purge") {
      const events = await guild.scheduledEvents.fetch();
      events?.forEach((event) => event.delete());

      await interaction.reply({
        content: "All scheduled events deleted.",
        ephemeral: true,
      });
    }
  },
};
