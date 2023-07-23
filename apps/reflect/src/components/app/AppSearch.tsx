import { InputBase } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.25),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.5),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "55%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  /*'& .Mui-focused' : {
        marginRight: '120px',
    },*/
  transition: theme.transitions.create("margin-right"),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
const AppSearch = () => {
  return (
    <Search sx={{ display: { xs: "none", md: "flex" } }}>
      <StyledInputBase
        placeholder="/"
        inputProps={{
          "aria-label": "search",
        }}
      />
    </Search>
  );
};

export default AppSearch;
