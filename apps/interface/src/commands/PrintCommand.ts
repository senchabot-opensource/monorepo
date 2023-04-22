import { useResponseContext } from "../contexts/ResponseContext";
import { AnyContextType } from "../types";
import { ICommand } from "./ICommand";

export function InitializePrintCommand(): ICommand {
  const responseContext: AnyContextType = useResponseContext();
  return new PrintCommand(responseContext);
}

export class PrintCommand implements ICommand {
  public name: string = "print";
  public aliases?: string[] | undefined = ["echo"];
  public params?: string[] = ["/", "_"];
  private responseContext: AnyContextType;

  private readonly InvalidParameterMessage =
    "Invalid parameter. Valid parameters are: /, _";

  constructor(responseContext: AnyContextType) {
    this.responseContext = responseContext;
  }

  public execute(parameters: string) {
    let args: string[] = parameters.split(" ");
    let type: string = args.shift() || "";

    if (!this.params?.includes(type))
      return this.setResponseState(
        "PARAMETER ERROR",
        this.InvalidParameterMessage,
      );

    var booleanType: boolean = type === "/" ? false : true;
    let message: string = args.join(" ");

    if (booleanType) this.setResponseState(message, undefined);
    else this.setResponseState("....", message);
  }

  setResponseState(message?: string, error?: string) {
    this.responseContext.setResponseState({
      lineText: message,
      outputText: [error],
    });
  }

  public help(): void {}

  public usage?: string = "/print </|_> <text>";
}
