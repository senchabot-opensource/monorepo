import React, { createContext, useContext, useMemo, useState } from "react";
import { ReactChildrenPropsType } from "../types";

export interface IInfoBox {
  infoBoxType: number;
  infoBoxText: string;
}

type InfoBoxContextType = {
  infoBox: IInfoBox;
  setInfoBox: React.Dispatch<React.SetStateAction<IInfoBox>>;
};

const defaultProps = {
  infoBox: {
    infoBoxType: 0,
    infoBoxText: "",
  },
  setInfoBox: () => {},
};

const InfoBoxContext = createContext<InfoBoxContextType>(defaultProps);
function InfoBoxContextProvider(Props: ReactChildrenPropsType) {
  const [infoBox, setInfoBox] = useState<IInfoBox>(defaultProps.infoBox);
  const infoBoxContext = useMemo(() => ({ infoBox, setInfoBox }), [infoBox]);
  return (
    <InfoBoxContext.Provider value={infoBoxContext}>
      {Props.children}
    </InfoBoxContext.Provider>
  );
}
function useInfoBoxContext() {
  const context = useContext(InfoBoxContext);
  if (context === undefined) {
    throw new Error(
      "useInfoBoxContext must be used within a InfoBoxContext.Provider",
    );
  }
  return context;
}

export { InfoBoxContextProvider, useInfoBoxContext };
