import {
  Input,
  InputAdornment,
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
import LoadingBox from "../loading/LoadingBox";
import { IBotCommand, IBotCommandAlias } from "../../types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useEffect, useMemo, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { getAliasList, getCommandList } from "src/api";

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
  const [isLoading, setIsLoading] = useState(true);
  const [botCommands, setBotCommands] = useState<IBotCommand[]>();
  const [aliasCommands, setAliasCommands] = useState<IBotCommandAlias[]>();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  useEffect(() => {
    getCommandList().then(res => {
      if (!res.data) return;
      setBotCommands(res.data);
      getAliasList().then(res => {
        setAliasCommands(res.data);
      });
      setIsLoading(false);
    });
  }, [isLoading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const filteredCommands = useMemo(() => {
    if (!searchValue) return botCommands;
    return botCommands?.filter((command: IBotCommand) =>
      command.commandName.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [botCommands, searchValue]);

  return (
    <Paper
      sx={{ mt: "10px", backgroundColor: "#000", padding: "10px" }}
      elevation={1}>
      <Stack>
        <Input
          fullWidth
          onChange={handleSearch}
          value={searchValue}
          placeholder="Search"
          startAdornment={
            <InputAdornment position="start">
              <BiSearchAlt />
            </InputAdornment>
          }
        />
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
            filteredCommands?.length ? (
              filteredCommands.map((command: IBotCommand, index: number) => {
                return (
                  <>
                    <Accordion
                      key={index}
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
