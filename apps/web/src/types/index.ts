export type AnyContextType = {
  [key: string]: any;
};

export interface IBotCommand {
  id: number;
  commandName: string;
  commandContent: string;
  twitchChannelId: string | null;
  discordServerId: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
}
//TODO: this interface need refactor when bot command table relation will be done
export interface IBotCommandAlias {
  id: number;
  commandAlias: string;
  commandName: string;
  createdAt: Date;
  createdBy: string | null;
  discordServerId: string | null;
  twitchChannelId: string | null;
}

export interface IBotActionActivity {
  botPlatformType: string;
  botActivity: string;
  activityDate: Date;
  discordServerId: string | null;
  twitchChannelId: string | null;
  activityAuthor: string | null;
}

export interface ITwitchBotConfig {
  key: any;
  value: any;
}

export interface ITwitchBotWebhookData {
  token: string;
  event: string;
  user_id: string | null | undefined;
}

export interface ITwitchBotFormSubmitData {
  bot_activity_enabled: string;
  mods_manage_cmds_enabled: string;
}

export interface IGetAllConfig {
  data: IConfig[];
  success: boolean;
}

export interface IConfig {
  [key: string]: string;
}

export interface ISetConfigInput {
  configs: IConfig[];
}

export interface IDiscordServer {
  serverId: string;
  serverName: string;
  serverOwner: string;
}

export interface ITwitchChannel {
  channelId: string;
  channelName: string;
}

export interface IAccount {
  provider: string;
  providerAccountId: string;
}
