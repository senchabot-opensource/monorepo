import { Mode } from "../enums";
import { ConfigMenu } from "./ConfigMenu";
import { appStyle } from "../styles";
import { InfoBox } from "./ui/InfoBox";
import TextLineWord from "./ui/TextLineWord";
import { InputManager } from "./InputManager";
import { useState } from "react";
import { useModeContext } from "../contexts/ModeContext";

const Main = () => {
  const [doubleClick, setDoubleClick] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(true);
  const { mode, setMode } = useModeContext();

  const handleKeyDown = (e: any) => {
    if (e.code === "Escape") setIsInputOpen(true);
    if (e.altKey && e.code === "KeyI") setIsInputOpen(prev => !prev);
  };

  const handleDoubleClick = (e: any) => {
    setDoubleClick(true);
    setMode(Mode.CONFIG);
  };

  return (
    <>
      {doubleClick && mode === Mode.CONFIG ? (
        <ConfigMenu />
      ) : (
        <>
          <div
            style={appStyle.body}
            onKeyDown={handleKeyDown}
            onDoubleClick={handleDoubleClick}
            tabIndex={-1}>
            <InfoBox />
            <TextLineWord />
          </div>
          <InputManager isInputOpen={isInputOpen} />
        </>
      )}
    </>
  );
};
export default Main;
