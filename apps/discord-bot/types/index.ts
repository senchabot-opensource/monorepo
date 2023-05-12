import {ChatInputCommandInteraction, Client, SlashCommandBuilder} from "discord.js";

export interface IOctoOptions {
  auth: string | undefined;
}

export interface IIssueParams {
  state: "open" | "closed" | "all" | undefined;
  sort: "created" | "updated" | "comments" | undefined;
}

export interface ICreateLiveStreamEventParams {
  platformDomain: string;
}

export interface ICommand {
  data: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction) => void
}

export interface IEvent {
    name: string
    execute: (...args: any[]) => void
    once?: boolean
}

export type IHandler = (client: Client) => void