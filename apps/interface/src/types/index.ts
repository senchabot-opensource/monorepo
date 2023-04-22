import {
  CSSProperties,
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from "react";

type AnyContextType = {
  [key: string]: any;
};

type InputContextType = {
  inputEnabled: boolean;
  inputValue: string;
};

type StyleType = { [key: string]: CSSProperties };

export interface IMainColor {
  background: string;
  foreground: string;
}

export interface ITextLineProps {
  lineSize: number;
  textWord: string;
}

export interface ITextWordProps {
  textWord: string;
}

type ReactChildrenPropsType = {
  children:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | ReactPortal;
};

export type {
  AnyContextType,
  InputContextType,
  ReactChildrenPropsType,
  StyleType,
};
