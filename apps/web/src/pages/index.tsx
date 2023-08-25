import React from "react";
import type { NextPage } from "next";
import Header from "../components/common/Header";
import LandingTexts from "../components/landing/LandingTexts";
import LandingContainer from "../components/landing/LandingContainer";

const Landing: NextPage = () => {
  return (
    <>
      <Header title="Landing" index={true} />
      <LandingContainer>
        <LandingTexts />
      </LandingContainer>
    </>
  );
};

export default Landing;
