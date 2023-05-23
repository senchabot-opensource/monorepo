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
import { IBotCommand, IBotCommandAlias } from "../../types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useEffect, useState } from "react";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion
    elevation={0}
    square={false}
    disableGutters={false}
    {...props}
  />
))(() => ({
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
  const commandAlias = trpc.command.getAliasList.useQuery();
  const [isLoading, setIsLoading] = useState(true);
  const [botCommands, setBotCommands] = useState<IBotCommand[]>();
  const [aliasCommands, setAliasCommands] = useState<IBotCommandAlias[]>();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  useEffect(() => {
    if (!commandList.isLoading) {
      if (!commandList.data) return;
      setBotCommands(commandList.data);
      setAliasCommands(commandAlias.data);
      setIsLoading(false);
    }
  }, [commandList, commandAlias]);

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
                        {/*// TODO: need to refactor this on bot command table relation done  */}
                        <ListItem dense key={index} disablePadding>
                          <ListItemText
                            sx={{
                              span: {
                                display: "flex",
                                alignItems: "center",
                              },
                            }}
                            primary={command.commandName}
                            secondary={aliasCommands
                              ?.filter(
                                (item: IBotCommandAlias) =>
                                  item.commandName === command.commandName,
                              )
                              .map((alias: IBotCommandAlias, index: number) => (
                                <>
                                  {/* if alias is first element add "Alias:" 
                                  before element else write alias directly it's best way because we can not have any 
                                  relation outside the array we have one alternative of this usage and that is run one
                                   more filter method so we already have 2 maping method  */}
                                  {index == 0
                                    ? "Alias: " + alias.commandAlias
                                    : ", " + alias.commandAlias}
                                  {/* this is add comma if alias is not last item */}
                                  {index == aliasCommands.length - 1 && ""}
                                </>
                              ))}
                          />
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
