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

export interface ITwitchBotWebhookData {
  token: string;
  event: string;
  user_name: string | null | undefined;
}

export type { AnyContextType, IAppBarButton, ILandingContainer, IHeader };
