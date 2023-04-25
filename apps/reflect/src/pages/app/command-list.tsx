import { NextPage } from "next";
import React from "react";
import { Offset } from "src/components/Offset";
import { AppContainer, AppSnackbar } from "src/components/app";
import CommandList from "src/components/app/CommandList";
import Header from "src/components/common/Header";

const CommandListPage: NextPage = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  React.useEffect(() => {
    const interval = setInterval(() => setIsLoading(false), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header title="Command List" index={false} />
      <AppContainer isLoading={isLoading}>
        <AppSnackbar
          isSnackbarOpen={snackbarOpen}
          snackbarMessage={snackbarMessage}
        />
        <CommandList />
        <Offset />
      </AppContainer>
    </>
  );
};

export default CommandListPage;
