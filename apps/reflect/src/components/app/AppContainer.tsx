import React, { FC } from "react";
import {
  Container,
  CssBaseline,
  Paper,
  Dialog,
  DialogContent,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import ResponsiveAppBar from "./AppBar";
import { darkTheme } from "../../utils/theme";
import Breadcrumb from "./Breadcrumb";
import { useSession } from "next-auth/react";
import Loading from "../loading/Loading";
import VersionText from "../common/VersionText";
import AuthContainer from "../auth/AuthContainer";

type IProps = {
  isLoading: boolean;
  children: React.ReactNode;
};

const AppContainer: FC<IProps> = ({ isLoading, children }) => {
  const { data: session, status: isAuthLoading } = useSession();
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Loading isLoading={isLoading} isAuthLoading={isAuthLoading} />

      {session ? (
        <>
          <ResponsiveAppBar
            isDrawerOpen={isDrawerOpen}
            drawerHandler={handleDrawer}
          />

          <Container>
            <Paper sx={{ mt: 10, backgroundColor: "#000", p: 1 }} elevation={1}>
              <Breadcrumb />
            </Paper>
            {children}
          </Container>
        </>
      ) : (
        !isLoading &&
        isAuthLoading !== "loading" && (
          <Dialog
            fullScreen={true}
            open={true}
            PaperProps={{
              elevation: 0,
              style: {
                backgroundColor: "black",
                boxShadow: "none",
                borderRadius: "8px",
                overflow: "hidden",
                height: "fit-content",
                width: "325px",
              },
            }}>
            <DialogContent
              sx={{
                padding: 2,
              }}>
              <AuthContainer />
            </DialogContent>
          </Dialog>
        )
      )}

      <VersionText />
    </ThemeProvider>
  );
};

export default AppContainer;
