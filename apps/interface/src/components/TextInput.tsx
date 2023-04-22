import { useTheme } from '@mui/material';
import { useContext } from 'react';
import { CommandContext } from '../contexts/CommandContext';
import { InputContext } from '../contexts/InputContext';
import { RunContext } from '../contexts/RunContext';
import { inputStyle } from '../styles';
import { AnyContextType } from '../types';

const TextInput = () => {
  const theme = useTheme();
  const foreground = theme.palette.primary.main;

  const { setIsRunning } = useContext(RunContext);
  const inputContext: AnyContextType = useContext(InputContext);
  const runCommandContext: AnyContextType = useContext(CommandContext);

  const { inputState, setInputState } = inputContext;
  const { runCommand } = runCommandContext;

  const handleInputChange = (e: any) => {
    setInputState({ inputEnabled: false, inputValue: e.target.value });
  };

  const handleKeyDown = (e: any) => {
    if (e.code === 'Escape')
      setInputState({ inputEnabled: true, inputValue: '' });
    if (e.key === 'Enter') {
      runCommand(e.target.value);
      setInputState({ inputEnabled: false, inputValue: '' });
      setIsRunning(true);
    }
  };

  return (
    <input
      type="text"
      className="input"
      style={inputStyle(foreground)}
      value={inputState.inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder="/"
      autoComplete="off"
      list="autocompleteOff"
      disabled={inputState.inputEnabled}
    />
  );
};

export default TextInput;
