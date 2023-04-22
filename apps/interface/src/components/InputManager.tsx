import { angleUpContainerStyle, appStyle } from "../styles";
import { useEffect, useMemo, useState } from "react";

import { InputContext } from "../contexts/InputContext";
import {
  ResponseProvider,
  useResponseContext,
} from "../contexts/ResponseContext";
import { CommandContext } from "../contexts/CommandContext";

import AngleUp from "./ui/AngleUp";
import TextInput from "./TextInput";
import TerminalInput from "./TerminalInput";

import { CommandRegistry } from "../commands/CommandRegistry";

import { useTheme } from "@mui/material";

import { AnyContextType, InputContextType } from "../types";

export const InputManager = ({ isInputOpen }: { isInputOpen: boolean }) => {
  const theme = useTheme();
  const primaryMainColor = theme.palette.primary.main;
  CommandRegistry.registerAllCommands();

  const responseContext: AnyContextType = useResponseContext();

  const { setResponseState } = responseContext;

  // Create state variables for inputEnabled and inputValue
  const [inputState, setInputState] = useState<InputContextType>({
    inputEnabled: true,
    inputValue: "",
  });

  // The setInputState in useEffect is executed by changing the value of the isInputOpen variable that comes as an prop from the App.tsx file with the trigger of the keyboard keys.
  useEffect(() => {
    // The setInputState function assigns the value isInputOpen to the inputEnabled value in the inputState object and sets the inputValue an empty string.
    setInputState({ inputEnabled: isInputOpen, inputValue: "" });
  }, [isInputOpen]);

  const inputContext = useMemo(
    () => ({
      inputState,
      setInputState,
    }),
    [inputState],
  );

  const runCommand = (cmdString: string) => {
    let splitCmdString = cmdString.split(" ");
    let commandName: any = splitCmdString.shift();
    let args = splitCmdString.join(" ");

    let lineText: string = "",
      outputText: string[] = [];

    if (commandName.startsWith("/")) {
      commandName = commandName.slice(1);

      let command = CommandRegistry.getCommand(commandName);
      if (command) {
        command.execute(args);
        return;
      }

      setResponseState({
        lineText: "Command not found." + lineText.toUpperCase(),
        outputText: outputText,
      });
    } else {
      setResponseState({
        lineText: "Please start command with /" + lineText.toUpperCase(),
        outputText: outputText,
      });
    }
  };

  const commandContextValue = useMemo(() => ({ runCommand }), []);

  return (
    <InputContext.Provider value={inputContext}>
      <CommandContext.Provider value={commandContextValue}>
        <ResponseProvider>
          <div style={appStyle.body}>
            <div
              className="angleUpContainer"
              style={angleUpContainerStyle(inputState)}
              onClick={() => {
                setInputState({
                  inputEnabled: !inputState.inputEnabled,
                  inputValue: "",
                });
              }}>
              <AngleUp foregroundColor={primaryMainColor} />
            </div>
            {true ? <TextInput /> : <TerminalInput />}
          </div>
        </ResponseProvider>
      </CommandContext.Provider>
    </InputContext.Provider>
  );
};
