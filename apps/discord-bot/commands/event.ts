import {
  ChatInputCommandInteraction,
  Guild,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandNumberOption,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { checkMemberPermission } from "../utils/memberFunctions";

const manageEventsPermFlag = PermissionFlagsBits.ManageEvents;

const eventCreateCommand = new SlashCommandSubcommandBuilder()
  .setName("create")
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName("event_name")
      .setDescription("Event name.")
      .setRequired(true),
  )
  .addNumberOption((option: SlashCommandNumberOption) =>
    option
      .setName("event_start_date")
      .setDescription("Event start time.")
      .setRequired(true),
  )
  .addStringOption((option: SlashCommandStringOption) =>
    option
      .setName("event_location")
      .setDescription("Event Location.")
      .setRequired(false),
  )
  .setDescription("Create scheduled guild events");

const eventPurgeCommand = new SlashCommandSubcommandBuilder()
  .setName("purge")
  .setDescription("Purge scheduled guild events");

export default {
  data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Manage guild events")
    .addSubcommand(eventCreateCommand)
    .addSubcommand(eventPurgeCommand)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;

    if (
      !checkMemberPermission(
        interaction.memberPermissions,
        manageEventsPermFlag,
      )
    ) {
      console.log(
        `MEMBER "${interaction.member?.user.username}" DOES NOT HAVE "MANAGE EVENTS" PERMISSION.`,
      );
      return;
    }

    if (interaction.options.getSubcommand() === "create") {
      const eventNameString = interaction.options.getString("event_name");
      const eventStartDateNumber =
        interaction.options.getNumber("event_start_date");

      if (!eventStartDateNumber || !eventNameString) return;
      const eventLocationtring =
        interaction.options.getString("event_location");

      let location = "";

      if (eventLocationtring) {
        location = eventLocationtring;
      }

      const eventOptions = {
        name: eventNameString,
        scheduledStartTime: eventStartDateNumber,
        scheduledEndTime: eventStartDateNumber,
        privacyLevel: 2,
        entityType: 3,
        entityMetadata: { location: location },
      };
      const event = guild.scheduledEvents.create(eventOptions);
      event.then(e => e.setLocation(location));
    }

    if (interaction.options.getSubcommand() === "purge") {
      const events = await guild.scheduledEvents.fetch();
      events?.forEach(event => event.delete());

      await interaction.reply({
        content: "All scheduled events deleted.",
        ephemeral: true,
      });
    }
  },
};
