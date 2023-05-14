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

interface IBotActionActivity {
  botPlatformType: string;
  botActivity: string;
  activityDate: Date;
  discordServerId: string | null;
  twitchChannelId: string | null;
  activityAuthor: string | null;
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
};
