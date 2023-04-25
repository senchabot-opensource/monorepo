import React from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
  Switch,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { trpc } from "../../utils/trpc";
import LoadingBox from "../loading/LoadingBox";
import { IBotCommand } from "../../types";

const CommandList = () => {
  const commandList = trpc.command.getCommandList.useQuery();
  const commandDelete = trpc.command.deleteCommand.useMutation();
  const [isLoading, setIsLoading] = React.useState(true);
  const [checked, setChecked] = React.useState<number[]>([]);
  const [botCommands, setBotCommands] = React.useState<IBotCommand[]>();

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleDelete = React.useCallback(
    (commandId: number) => {
      if (!botCommands) return;
      const filteredCommands = botCommands.filter(
        (command: IBotCommand) => command.id !== commandId,
      );
      setBotCommands(filteredCommands);
      commandDelete.mutate({ id: commandId });
    },
    [botCommands],
  );

  React.useEffect(() => {
    if (!commandList.isLoading) {
      if (!commandList.data) return;
      setBotCommands(commandList.data);
      setIsLoading(false);
    }
  }, [commandList]);

  return (
    <Paper
      sx={{ mt: "10px", backgroundColor: "#000", padding: "10px" }}
      elevation={1}>
      <Stack>
        <List
          dense={false}
          sx={{ width: "100%", backgroundColor: "#000" }}
          subheader={
            <ListSubheader sx={{ backgroundColor: "#000" }} disableSticky>
              Command List:
            </ListSubheader>
          }
          disablePadding>
          {!isLoading ? (
            botCommands?.length ? (
              botCommands.map((command: IBotCommand, index: number) => {
                const labelId = `switch-list-label-${command.id}`;

                return (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <ListItemIcon>
                        <Switch
                          edge="end"
                          onChange={handleToggle(command.id)}
                          checked={checked.indexOf(command.id) !== -1}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </ListItemIcon>
                    }
                    disablePadding>
                    <ListItemButton dense>
                      {
                        <ListItemIcon onClick={() => handleDelete(command.id)}>
                          <IconButton
                            edge="end"
                            aria-label="delele the command">
                            <ClearIcon />
                          </IconButton>
                        </ListItemIcon>
                      }
                      <ListItemText
                        primary={command.commandName}
                        secondary={command.commandContent}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })
            ) : (
              <ListItem>
                <ListItemText primary="No data." />
              </ListItem>
            )
          ) : (
            <LoadingBox />
          )}
        </List>
      </Stack>
    </Paper>
  );
};

export default CommandList;
