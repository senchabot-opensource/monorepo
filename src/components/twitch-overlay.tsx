import React from "react";
import { alpha, CssBaseline, ThemeProvider } from "@mui/material";
import ComfyJS from "comfy.js";
import Head from "next/head";
import { appStyle, outputCornerStyle } from "../styles/sencha";
import { muiTheme } from "../pages/sencha/UIApp";
import dynamic from "next/dynamic";

ComfyJS.Init("corefunctionsinitiated");

const TwitchOverlay = () => {
  muiTheme.palette.background.default = alpha("#000", 0);

  const [message, setMessage] = React.useState("");

  const chat = document.querySelector("#chat>ul");
  /*
     | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | null
    | undefined
     */
  const [outputText, setOutputText] = React.useState<string[]>([""]);

  ComfyJS.onChat = (
    user: string,
    message: string,
    flags: any,
    self: any,
    extra: any
  ) => {
    setMessage(user + ": " + message);
    //console.log(flags, self, extra.userColor);
  };

  React.useEffect(() => {
    const outputTexts =
      typeof document !== "undefined" && document.createElement("li");
    if (!outputTexts) return;
    outputTexts.innerText = message;
    outputTexts.style.color = "#FF0000";
    if (!chat) return;
    chat?.append(outputTexts);
    /*if (chat?.getElementsByTagName("li").length > 8) {
      chat.innerText = "";
    }*/
    /*if (message.length) {
      setOutputText((outputText) => [...outputText, message + "\n"]);
    } else {
      setOutputText([message]);
    }*/
  }, [message]);

  /*React.useEffect(() => {
    if (outputText.length > 8) {
      setOutputText([message]);
    }
  }, [outputText.length]);*/

  /*React.useEffect(() => {
    console.log(chat?.getElementsByTagName("li").length);
  }, [chat?.getElementsByTagName("li").length]);*/

  return (
    <>
      <Head>
        <title>Twitch Overlay</title>
        <meta name="description" content="Twitch Overlay" />
        <style>{`
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }`}</style>
      </Head>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div style={appStyle}>
          <div
            style={{
              position: "relative",
              top: "10px",
              left: "10px",
              right: "10px",
              bottom: "10px",
              maxWidth: "600px",
              borderStyle: "solid",
              borderColor: "none", // alpha("#00ff00", 0.4)
              //display: "inline-block", // flex
              //inlineSize: "min-content",
              userSelect: "none",
              padding: "4px",
              backgroundColor: alpha("#000", 0.9),
            }}
          >
            <div
              style={{
                ...outputCornerStyle.text,

                color: "#fff",
              }}
              id="chat"
            >
              <ul
                style={{ listStyleType: "none", listStylePosition: "outside" }}
              ></ul>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default TwitchOverlay;
