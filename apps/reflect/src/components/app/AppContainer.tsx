import React from "react";
import {
  Container,
  CssBaseline,
  Paper,
  Dialog,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import ResponsiveAppBar from "./AppBar";

import { darkTheme } from "../../utils/theme";
import Breadcrumb from "./Breadcrumb";
import { useSession } from "next-auth/react";
import { AuthContainer } from "../auth/AuthContainer";
import Loading from "../loading/Loading";
import AppSnackbar from "./AppSnackbar";

export interface IAppContainer {
  isLoading: boolean;
  children: React.ReactNode;
}

export default function AppContainer({ isLoading, children }: IAppContainer) {
  const { data: session, status: isAuthLoading } = useSession();
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const [snackbarData, setSnackbarData] = React.useState(undefined);

  const handleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Loading isLoading={isLoading} isAuthLoading={isAuthLoading} />

      <AppSnackbar isSnackbarOpen={false} snackbarMessage={"a"} />
      {session ? (
        <>
          <ResponsiveAppBar
            isDrawerOpen={isDrawerOpen}
            drawerHandler={handleDrawer}
          />

          <Container>
            {/*<AppDrawer isDrawerOpen={isDrawerOpen} drawerHandler={handleDrawer} />*/}

            <Paper sx={{ mt: 10, backgroundColor: "#000", p: 1 }} elevation={1}>
              <Breadcrumb />
            </Paper>
            {children}
          </Container>
        </>
      ) : (
        !isLoading &&
        isAuthLoading !== "loading" && (
          <Dialog open={true}>
            <AuthContainer />
          </Dialog>
        )
      )}

      <Typography sx={{ position: "fixed", bottom: 16, right: 16 }}>
        pre-alpha
      </Typography>
    </ThemeProvider>
  );
}
