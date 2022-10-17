import React from "react";
import { keyframes } from "@mui/system";
import { styled } from "@mui/material/styles";
import SyntaxHighlighter from "react-syntax-highlighter";
import { Paper } from "@mui/material";

/*const blink = keyframes`
    from { opacity: 0; }
    tp { opacity: 1; }
`;*/

/*const BlinkedCursor = styled("div")({
  backgroundColor: "#fff",
  width: "28",
  height: "10",
  animation: `${blink} 1s ease-in-out infinite`,
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}*/

const TypingEffect = () => {
  const codeString = "const abc = 0;\nif (!abc) return";
  const typingStateArr = ["isTyping", "isDeleting"];
  const [typingText, setTypingText] = React.useState("");
  const [typingState, setTypingState] = React.useState(typingStateArr[0]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setTypingText(codeString.slice(0, typingText.length + 1));
    }, 100);
    return () => clearTimeout(timeout);
  }, [typingText]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (typingState === "isTyping" && typingText !== codeString) {
        setTypingText(codeString.slice(0, typingText.length + 1));
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [codeString, typingState]);

  return (
    <>
      {/*<Box
        sx={{
          display: "flex",
          "& > :not(style)": {
            m: 16,
            p: 2,
            border: "1px solid grey",
            width: 256,
            height: 128,
            opacity: [0.9, 0.8, 0.7],
          },

          //ml: 10,
        }}
      >*/}
      <Paper
        elevation={0}
        sx={{ backgroundColor: "#000", variant: "outlined" }}
        square
      >
        <SyntaxHighlighter
          customStyle={{ backgroundColor: "#000" }}
          language="javascript"
        >
          {typingText}
        </SyntaxHighlighter>
      </Paper>
      {/*</Box>*/}
    </>
  );
};

export default TypingEffect;
