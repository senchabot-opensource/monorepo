import { useResponseContext } from "../contexts/ResponseContext";
import { AnyContextType } from "../types";
import { ICommand } from "./ICommand";

export function InitializeFullscreenCommand(): ICommand {
  const responseContext: AnyContextType = useResponseContext();
  return new FullscreenCommand(responseContext);
}

export class FullscreenCommand implements ICommand {
  public name: string = "fullscreen";
  private responseContext: AnyContextType;

  constructor(responseContext: AnyContextType) {
    this.responseContext = responseContext;
  }

  public execute(parameters: string): void {
    var elem = document.documentElement;
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.setResponseState("Fullscreen Mode Deactivated.");
        return;
      }
    } else {
      if (document.fullscreenEnabled && elem.requestFullscreen)
        elem.requestFullscreen();
    }

    this.setResponseState("Fullscreen Mode Activated.");
  }

  setResponseState(message: string) {
    this.responseContext.setResponseState({
      lineText: "....",
      outputText: [message],
    });
  }

  public help(): void {}

  public usage?: string = "/fullscreen";
}
