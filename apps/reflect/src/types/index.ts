import { ReactElement } from "react";

type AnyContextType = {
  [key: string]: any;
};

interface IAppBarButton {
  title: string;
  pathHref: string;
  ariaLabel: string;
  drawerHandler: () => void;
  children: ReactElement;
}

interface ILandingContainer {
  children: React.ReactNode;
}

interface IHeader {
  title: string;
  index: boolean;
}

interface IBotCommand {
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
interface IBotCommandAlias {
  id: string;
  commandAlias: string;
  commandName: string;
  createdAt: Date;
  createdBy?: string;
  discordServerId?: string;
  twitchChannelId?: string;
}

interface IBotActionActivity {
  botPlatformType: string;
  botActivity: string;
  activityDate: Date;
  discordServerId: string | null;
  twitchChannelId: string | null;
  commandAuthor: string | null;
}

interface ITwitchBotConfig {
  key: any;
  value: any;
}

interface ITwitchBotFormSubmitData {
  bot_activity_enabled: string;
  mods_manage_cmds_enabled: string;
}

export type {
  AnyContextType,
  IAppBarButton,
  ILandingContainer,
  IHeader,
  IBotCommand,
  IBotActionActivity,
  ITwitchBotFormSubmitData,
  ITwitchBotConfig,
  IBotCommandAlias,
};
