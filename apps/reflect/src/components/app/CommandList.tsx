import React from "react";
import {
  AccordionDetails,
  AccordionSummary,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import ClearIcon from "@mui/icons-material/Clear";
import { trpc } from "../../utils/trpc";
import LoadingBox from "../loading/LoadingBox";
import { IBotCommand } from "../../types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion
    elevation={0}
    square={false}
    disableGutters={false}
    {...props}
  />
))(({ theme }) => ({
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

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
                  <>
                    <Accordion sx={{ backgroundColor: "#000" }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{ backgroundColor: "#000" }}>
                        <ListItem
                          dense
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
                          {
                            <ListItemIcon
                              onClick={() => handleDelete(command.id)}>
                              <IconButton
                                edge="end"
                                aria-label="delele the command">
                                <ClearIcon />
                              </IconButton>
                            </ListItemIcon>
                          }
                          <ListItemText
                            primary={command.commandName}
                            secondary="Aliases: No data."
                          />
                        </ListItem>
                      </AccordionSummary>
                      <AccordionDetails sx={{ backgroundColor: "#000" }}>
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell align="left">
                                Created&nbsp;At
                              </TableCell>
                              <TableCell align="left">
                                Created&nbsp;By
                              </TableCell>
                              <TableCell align="left">
                                Updated&nbsp;By
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow
                              key={index}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}>
                              <TableCell align="left">
                                {command.createdAt.toDateString()}
                              </TableCell>
                              <TableCell align="left">corefun</TableCell>
                              <TableCell align="left">corefun</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  </>
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
