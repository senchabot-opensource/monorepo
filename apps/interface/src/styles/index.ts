import { IInfoBox } from "../contexts/InfoBoxContext";
import { InputContextType, ITextLineProps, StyleType } from "../types";

const appStyle: StyleType = {
  body: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: "1",
  },
};

const outputCornerStyle: StyleType = {
  container: {
    position: "absolute",
    top: "10px",
    left: "10px",
    right: "10px",
    bottom: "10px",
    overflowWrap: "break-word",
    userSelect: "none",
  },
  text: {
    fontFamily: "Source Code Pro",
    fontSize: "16px",
    whiteSpace: "pre-line",
    transition: "background 500ms linear",
    color: "white",
  },
};

const configMenuStyle: StyleType = {
  container: {
    position: "absolute",
    top: "10px",
    left: "10px",
    right: "10px",
    bottom: "10px",
    overflowWrap: "break-word",
    userSelect: "none",
    backgroundColor: "#000",
    padding: "16px",
  },
  text: {
    fontFamily: "Source Code Pro",
    fontSize: "16px",
    whiteSpace: "pre-line",
    transition: "background 500ms linear",
    color: "white",
  },
  button: {
    fontWeight: "bold",
  },
  buttonHover: {
    backgroundColor: "white",
    color: "black",
    borderColor: "white",
  },
};

const buttonStyle: StyleType = {
  container: {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
  },
  buttonBox: {
    fontFamily: "Source Code Pro",
    fontSize: "16px",
    padding: "2px 4px",
    marginLeft: "8px",
    cursor: "default",
    userSelect: "none",
    transition: "background 500ms linear",
  },
};

const infoBoxStyle: StyleType = {
  timerTextStyle: {
    fontSize: "18px",
    fontFamily: "Source Code Pro",
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
  infoTextStyle: {
    fontSize: "18px",
    fontFamily: "Source Code Pro",
    textAlign: "left",
  },
};

const terminalStyle: StyleType = {
  container: {
    position: "absolute",
    bottom: "420px",
    padding: "2px 8px",
    width: "280px",
    height: "140px",
    background: "rgba(200,200,200,0.9)",
    color: "black",
  },
};

const bootLineStyle = (bootLineColor: string) => {
  return {
    background: bootLineColor,
    borderLeft: `3px solid ${bootLineColor}`,
  };
};

const textLineStyle = (color: string, props: ITextLineProps) => {
  const style: StyleType = {
    line: {
      marginTop: "2.4em",
      width: "28px",
      transitionProperty: "width",
      transitionTimingFunction: "linear",
      userSelect: "none",
    },
  };

  style.line.width = props.lineSize;

  return {
    ...style.line,
    color: color,
    borderTop: `3.2px solid ${color}`,
    transitionDuration: props.textWord ? "0.1s" : "200ms",
  };
};

const textWordStyle = (color: string) => {
  const style: StyleType = {
    text: {
      position: "absolute",
      textAlign: "center",
      whiteSpace: "nowrap",
      textTransform: "uppercase",
      fontFamily: "reem",
      fontSize: "28px",
      userSelect: "none",
    },
  };

  return { ...style.text, color: color };
};

const inputStyle = (foreground: string) => {
  return {
    border: `2px solid ${foreground}`,
    caretColor: foreground,
    color: foreground,
  };
};

const angleUpContainerStyle = (inputState: InputContextType) => {
  return {
    bottom: inputState.inputEnabled ? "32px" : "80px",
    transform: !inputState.inputEnabled ? "rotateX(180deg)" : "",
  };
};

const infoBoxContainerStyle = (
  isBackgroundTransparent: boolean,
  infoBox: IInfoBox,
  foregroundColor: string,
) => {
  const style: StyleType = {
    container: {
      position: "absolute",
      marginBottom: "256px",
      width: "342px",
      maxWidth: "342",
      padding: "5px 15px",
      cursor: "default",
      userSelect: "none",
      whiteSpace: "pre-line",
      transition: "opacity 0.5s ease-in-out",
      transitionDuration: "200ms",
    },
  };

  return isBackgroundTransparent
    ? {
        ...style.container,
        backgroundColor: "transparent",
        opacity: !infoBox.infoBoxText ? 0 : 1,
      }
    : {
        ...style.container,
        backgroundColor: foregroundColor,
        borderTop: `2px solid ${foregroundColor}`,
        borderBottom: `2px solid ${foregroundColor}`,
        opacity: !infoBox.infoBoxText ? 0 : 1,
      };
};

export {
  appStyle,
  buttonStyle,
  infoBoxStyle,
  terminalStyle,
  outputCornerStyle,
  configMenuStyle,
  bootLineStyle,
  textLineStyle,
  textWordStyle,
  inputStyle,
  angleUpContainerStyle,
  infoBoxContainerStyle,
};
