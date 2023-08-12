import React, { FC } from "react";
import {
  Container,
  CssBaseline,
  Paper,
  Dialog,
  DialogContent,
} from "@mui/material";
import ResponsiveAppBar from "./AppBar";
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
    <>
      <CssBaseline />
      <Loading isLoading={isLoading} isAuthLoading={isAuthLoading} />

      {session ? (
        <>
          <ResponsiveAppBar
            isDrawerOpen={isDrawerOpen}
            drawerHandler={handleDrawer}
          />

          <Container>
            <Paper
              sx={{
                mt: 10,
                backgroundImage: "none",
                backgroundColor: "appBreadcrumb.background",
                p: 1,
              }}
              elevation={1}>
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
                backgroundColor: "appLoginForm.border",
              }}>
              <AuthContainer />
            </DialogContent>
          </Dialog>
        )
      )}

      <VersionText />
    </>
  );
};

export default AppContainer;
