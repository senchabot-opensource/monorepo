import React from "react";
import { NextPage } from "next";
import { Offset } from "../../components/Offset";
import SystemMessage from "../../components/app/SystemMessage";
import BotActivity from "../../components/app/BotActivity";
import Header from "../../components/common/Header";
import AppContainer from "../../components/app/AppContainer";

const Dashboard: NextPage = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const interval = setInterval(() => setIsLoading(false), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header title="App" index={true} />
      <AppContainer isLoading={isLoading}>
        <SystemMessage />
        <BotActivity />
        <Offset />
      </AppContainer>
    </>
  );
};

export default Dashboard;
