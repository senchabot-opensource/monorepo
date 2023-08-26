import React from "react";
import type { NextPage } from "next";
import { CssBaseline } from "@mui/material";
import Header from "../components/common/Header";
import LandingLayout from "src/components/landing/layout/LandingLayout";
import Hero from "src/components/landing/home/Hero";
import Trusted from "src/components/landing/home/Trusted";
import Features from "src/components/landing/home/features/Features";
import FooterUpper from "src/components/landing/home/FooterUpper";

const Landing: NextPage = () => {
  return (
    <>
      <Header title="Landing" index={true} />
      <CssBaseline />
      <LandingLayout>
        <Hero />
        <Trusted />
        <Features />
        <FooterUpper />
      </LandingLayout>
    </>
  );
};

export default Landing;
