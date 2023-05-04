import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { Paper } from "@mui/material";

const TypingEffect = () => {
  const codeString = "const abc = 0;\nif (!abc) return";
  const [typingText, setTypingText] = React.useState("");

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setTypingText(codeString.slice(0, typingText.length + 1));
    }, 100);
    return () => clearTimeout(timeout);
  }, [typingText]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{ backgroundColor: "#000", variant: "outlined" }}
        square>
        <SyntaxHighlighter
          customStyle={{ backgroundColor: "#000" }}
          language="javascript">
          {typingText}
        </SyntaxHighlighter>
      </Paper>
    </>
  );
};

export default TypingEffect;
