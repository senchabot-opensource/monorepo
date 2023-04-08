import React from "react";
import { NextPage } from "next";
import { AppContainer, AppHeader, AppSnackbar } from "../../components/app";
import { Offset } from "../../components/Offset";
import SystemMessage from "src/components/app/SystemMessage";
import BotActivity from "src/components/app/BotActivity";

const Dashboard: NextPage = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  React.useEffect(() => {
    const interval = setInterval(() => setIsLoading(false), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AppHeader title="App" index={true} />
      <AppContainer isLoading={isLoading}>
        <AppSnackbar
          isSnackbarOpen={snackbarOpen}
          snackbarMessage={snackbarMessage}
        />
        <SystemMessage />
        <BotActivity />
        <Offset />
      </AppContainer>
    </>
  );
};

export default Dashboard;
