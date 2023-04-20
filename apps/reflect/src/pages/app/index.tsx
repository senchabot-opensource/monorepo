import React from "react";
import { NextPage } from "next";
import { AppContainer, AppSnackbar } from "../../components/app";
import { Offset } from "../../components/Offset";
import SystemMessage from "../../components/app/SystemMessage";
import BotActivity from "../../components/app/BotActivity";
import Header from "../../components/common/Header";

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
      <Header title="App" index={true} />
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
