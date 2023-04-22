import React, { createContext } from "react";

type RunContextType = {
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
};

const iRunContextState = {
  isRunning: true,
  setIsRunning: () => {},
};

export const RunContext = createContext<RunContextType>(iRunContextState);
