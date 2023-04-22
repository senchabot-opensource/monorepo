import { InitializeCmdListCommand } from "./CmdListCommand";
import { InitializeColorCommand } from "./ColorCommand";
import { InitializeFullscreenCommand } from "./FullscreenCommand";
import { ICommand } from "./ICommand";
import { InitializePrintCommand } from "./PrintCommand";
import { InitializeThemeCommand } from "./ThemeCommand";

export class CommandRegistry {
  private _Commands: ICommand[] = [];
  public get Commands(): ICommand[] {
    return this._Commands;
  }

  public addCommand(command: ICommand): void {
    this._Commands.push(command);
  }

  public getCommand(name: string): ICommand | undefined {
    return this._Commands.find(
      c => c.name === name || c.aliases?.includes(name),
    );
  }

  private static _instance: CommandRegistry;
  public static get instance(): CommandRegistry {
    if (CommandRegistry._instance === undefined)
      CommandRegistry._instance = new CommandRegistry();
    return CommandRegistry._instance;
  }

  public static AddCommand(command: ICommand): void {
    if (CommandRegistry.instance.getCommand(command.name) === undefined)
      CommandRegistry.instance.addCommand(command);
  }

  public static getCommand(name: string): ICommand | undefined {
    return CommandRegistry.instance.getCommand(name);
  }

  public static Commands(): ICommand[] {
    return CommandRegistry.instance.Commands;
  }

  public static registerAllCommands(): void {
    CommandRegistry.AddCommand(InitializeColorCommand());
    CommandRegistry.AddCommand(InitializeThemeCommand());
    CommandRegistry.AddCommand(InitializePrintCommand());
    CommandRegistry.AddCommand(InitializeFullscreenCommand());
    CommandRegistry.AddCommand(InitializeCmdListCommand());
  }
}
