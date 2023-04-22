import { useResponseContext } from "../contexts/ResponseContext";
import { AnyContextType } from "../types";
import { CommandRegistry } from "./CommandRegistry";
import { ICommand } from "./ICommand";

export function InitializeCmdListCommand(): ICommand {
  const responseContext: AnyContextType = useResponseContext();
  return new CmdListCommand(responseContext);
}

export class CmdListCommand implements ICommand {
  public name: string = "cmds";
  private responseContext: AnyContextType;

  constructor(responseContext: AnyContextType) {
    this.responseContext = responseContext;
  }

  public execute(args: string): void {
    const commands = CommandRegistry.Commands();

    let commandList: string[] = [];

    commands.filter(r => commandList.push(r.usage || ""));

    console.log("commandList", commandList);

    this.setResponseState(commandList);
  }

  setResponseState(message: string[]) {
    this.responseContext.setResponseState({
      lineText: "....",
      outputText: message,
    });
  }

  public help(): void {}
}
