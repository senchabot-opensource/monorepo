import { useContext, useEffect, useState } from "react";

import { RunContext } from "../../../contexts/RunContext";
import { useResponseContext } from "../../../contexts/ResponseContext";

import { getTextWidth } from "../../../utils/functions";
import { useRecursiveTimeout } from "../../../utils/hooks";
import { AnyContextType } from "../../../types";

import Line from "./Line";
import Word from "./Word";

const TextLineWord = () => {
  const { isRunning, setIsRunning } = useContext(RunContext);
  const responseContext: AnyContextType = useResponseContext();

  const [words, setWordArray] = useState<string[]>([]);
  const [word, setWord] = useState("");
  const [wordWidth, setWordWidth] = useState(28);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordTimeout, setWordTimeout] = useState(500);

  const lineText = responseContext.responseState.lineText;

  useEffect(() => {
    if (isRunning) {
      setIsRunning(false);
      var upperCaseLineText = lineText.toUpperCase();
      setWordArray(upperCaseLineText.split(" "));
      setWordIndex(0);
    }
  }, [isRunning]);

  useEffect(() => {
    if (word === undefined) setWord("");
    setWordWidth(getTextWidth(word, "reem"));
  }, [word]);

  useRecursiveTimeout(
    () =>
      new Promise<void>(r => {
        if (wordIndex <= words.length) {
          if (wordIndex === 0 || wordIndex === words.length - 1)
            setWordTimeout(1000);
          else setWordTimeout(500);

          setWord(words[wordIndex]);
          setWordIndex(wordIndex + 1);
        }
        r();
      }),
    wordTimeout,
    0,
  );

  const calculatedLineSize = wordWidth ? wordWidth * 3 + 10 : 28;
  return (
    <>
      <Word textWord={word} />
      <Line textWord={word} lineSize={calculatedLineSize} />
    </>
  );
};

export default TextLineWord;
