import { NextPage } from "next";
import React from "react";
import { Offset } from "src/components/Offset";
import CommandList from "src/components/app/CommandList";
import Header from "src/components/common/Header";
import AppContainer from "../../components/app/AppContainer";

const CommandListPage: NextPage = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const interval = setInterval(() => setIsLoading(false), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header title="Command List" index={false} />
      <AppContainer isLoading={isLoading}>
        <CommandList />
        <Offset />
      </AppContainer>
    </>
  );
};

export default CommandListPage;
