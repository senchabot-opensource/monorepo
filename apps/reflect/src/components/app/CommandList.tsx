import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import { trpc } from "../../utils/trpc";
import LoadingBox from "../loading/LoadingBox";
import { IBotCommand } from "../../types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

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

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ExpandMoreIcon />} {...props} />
))(({ theme }) => ({
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(0),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(0),
}));

const CommandList = () => {
  const commandList = trpc.command.getCommandList.useQuery();
  const [isLoading, setIsLoading] = React.useState(true);
  const [botCommands, setBotCommands] = React.useState<IBotCommand[]>();

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

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
                    <Accordion
                      expanded={expanded === "panel" + index.toString()}
                      onChange={handleChange("panel" + index.toString())}
                      sx={{ backgroundColor: "#000" }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{
                          backgroundColor: "#000",
                        }}>
                        <ListItem dense key={index} disablePadding>
                          <ListItemText primary={command.commandName} />
                        </ListItem>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          backgroundColor: "#000",
                          borderTopColor: "#000",
                          borderStyle: "solid",
                        }}>
                        <Typography paddingLeft={2}>
                          {command.commandContent}
                        </Typography>
                        <Table aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell align="left">
                                Created&nbsp;At
                              </TableCell>
                              <TableCell align="left">
                                Created&nbsp;By
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  display: { xs: "none", md: "block" },
                                }}>
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
                              <TableCell
                                align="left"
                                sx={{ wordWrap: "inherit" }}>
                                {command.createdAt.toDateString()}
                              </TableCell>
                              <TableCell
                                align="left"
                                sx={{ wordWrap: "inherit" }}>
                                {command.createdBy}
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  wordWrap: "inherit",
                                  display: { xs: "none", md: "block" },
                                }}>
                                {command.updatedBy}
                              </TableCell>
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
