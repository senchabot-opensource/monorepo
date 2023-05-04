import React from "react";
import {
  Container,
  CssBaseline,
  Paper,
  Dialog,
  Typography,
  DialogContent,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import ResponsiveAppBar from "./AppBar";

import { darkTheme } from "../../utils/theme";
import Breadcrumb from "./Breadcrumb";
import { useSession } from "next-auth/react";
import { AuthContainer } from "../auth/AuthContainer";
import Loading from "../loading/Loading";
import VersionText from "../common/VersionText";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";

export interface IAppContainer {
  isLoading: boolean;
  children: React.ReactNode;
}

export default function AppContainer({ isLoading, children }: IAppContainer) {
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
}
