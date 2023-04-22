import { HOST } from "../config";
import { AnyContextType, IMainColor } from "../types";
import { Config } from "./config.class";

export class Theme extends Config {
  private _themeName = "custom";
  private _themeData: { [key: string]: string } = {};
  private colorsObj: IMainColor = { background: "", foreground: "" };
  private setResponseState;

  constructor(responseState: AnyContextType) {
    super();
    const { setResponseState } = responseState;
    this.setResponseState = setResponseState;
  }

  get themeName(): string {
    return this._themeName;
  }

  set themeName(value: string) {
    this._themeName = value;
    this.refreshTheme();
  }

  public getColors() {
    const localStorageColors = super.getParsedConfig("themeColors");

    const localColors = localStorageColors && {
      background: localStorageColors.background,
      foreground: localStorageColors.foreground,
    };

    this.colorsObj = {
      background: "#000",
      foreground: "#f2f2f2",
    };

    if (localColors) {
      this.colorsObj = localColors;
    }

    super.setConfig("themeColors", JSON.stringify(this.colorsObj));

    return this.colorsObj;
  }

  public updateColors(bg: string, fg: string) {
    this.colorsObj = { background: bg, foreground: fg };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //'Authorization':
      },
      body: JSON.stringify(this.colorsObj),
    };

    fetch(HOST + "api/themes", requestOptions)
      .then(async response => {
        const isJSON = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJSON && (await response.json());

        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        console.log(data.message);
      })
      .catch(error => {
        console.error("There is an error!", error);
      });

    super.setConfig("themeColors", JSON.stringify(this.colorsObj));
    super.setConfig("colorTheme", JSON.stringify(this.themeName));
  }

  private refreshTheme() {
    fetch(HOST + "api/themes/" + this.themeName)
      .then(async response => {
        if (!response.ok) return Promise.reject(response.status);
        else {
          const responseData = await response.json();

          if (responseData.message) {
            this.setResponseState({
              lineText: "./",
              outputText: [
                "Connecting to the server...",
                "Status Check: OK",
                responseData.message,
              ],
            });

            this._themeData = super.getParsedConfig("themeColors") || {
              background: "black",
              foreground: "white",
            };
            this.themeName = "custom";
          } else {
            this._themeData = responseData;
            this.setResponseState({
              lineText: "",
              outputText: ["Theme changed successfully."],
            });
          }

          super.setConfig("colorTheme", JSON.stringify(this.themeName));
          super.setConfig("themeColors", JSON.stringify(this._themeData));
        }
      })
      .catch(error =>
        this.setResponseState({
          lineText: "Network Error",
          outputText: ["Connecting to the server...", "Status Check", error],
        }),
      );
  }
}
