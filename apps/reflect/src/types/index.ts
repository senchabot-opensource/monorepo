import { ReactElement } from "react";
import { string } from "zod";

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
  discordServerId: string;
  twitchChannelId: string;
  commandAuthor: string;
}

export type {
  AnyContextType,
  IAppBarButton,
  ILandingContainer,
  IHeader,
  IBotCommand,
  IBotActionActivity
};