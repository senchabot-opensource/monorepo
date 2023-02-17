import {
  Client,
  ClientOptions,
  Collection,
  CommandInteraction,
} from "discord.js";

export interface IDiscordClient {
  commands: Collection<string, CommandInteraction>;
}

export default class DiscordClient extends Client implements IDiscordClient {
  public commands: Collection<string, CommandInteraction>;
  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }
}
