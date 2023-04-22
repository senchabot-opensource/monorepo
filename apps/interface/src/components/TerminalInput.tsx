import Draggable from "react-draggable";
import { terminalStyle } from "../styles";

const TerminalInput = () => {
  return (
    <Draggable>
      <div style={terminalStyle.container}>test</div>
    </Draggable>
  );
};

export default TerminalInput;
