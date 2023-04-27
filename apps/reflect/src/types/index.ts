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
  IBotActionActivity,
};
