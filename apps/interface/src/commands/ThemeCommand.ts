import { useResponseContext } from "../contexts/ResponseContext";
import { AnyContextType } from "../types";
import { Theme } from "../utils/theme.class";
import { ICommand } from "./ICommand";

export function InitializeThemeCommand(): ICommand {
  const responseContext: AnyContextType = useResponseContext();
  return new ThemeCommand(responseContext);
}

export class ThemeCommand implements ICommand {
  public name: string = "theme";
  private responseContext: AnyContextType;

  constructor(responseContext: AnyContextType) {
    this.responseContext = responseContext;
  }

  public execute(parameters: string) {
    let args: string[] = parameters.split(" ");

    let theme = new Theme(this.responseContext);

    theme.themeName = args[0];
  }

  public help() {}

  public usage?: string = "/theme <theme name>";
}
