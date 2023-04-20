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

export type { AnyContextType, IAppBarButton, ILandingContainer };
