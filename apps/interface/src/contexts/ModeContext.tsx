import React, { createContext, useMemo, useState } from "react";
import { Mode } from "../enums";
import { ReactChildrenPropsType } from "../types";

type ModeContextType = {
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
};

const defaultProps = {
  mode: 0,
  setMode: () => {},
};
const ModeContext = createContext<ModeContextType>(defaultProps);
function ModeContextProvider(Props: ReactChildrenPropsType) {
  const [mode, setMode] = useState<Mode>(Mode.MAIN);
  const modeContext = useMemo(() => ({ mode, setMode }), [mode]);
  return (
    <ModeContext.Provider value={modeContext}>
      {Props.children}
    </ModeContext.Provider>
  );
}

function useModeContext() {
  const context = React.useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useModeContext must be used within a ModeContextProvider");
  }
  return context;
}

export { ModeContextProvider, useModeContext };
