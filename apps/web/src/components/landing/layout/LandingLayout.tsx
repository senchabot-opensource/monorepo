import type { FC, ReactNode } from "react";
import Navbar from "../Navbr";
import { Box, Stack } from "@mui/material";
import FooterNav from "../FooterNav";
import Footer from "../Footer";

interface MainLayoutProps {
  children?: ReactNode;
}

const LandingLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <Stack bgcolor="#ECFFFA">
      <Navbar />
      {children}
      <FooterNav />
      <Footer />
    </Stack>
  );
};

export default LandingLayout;
