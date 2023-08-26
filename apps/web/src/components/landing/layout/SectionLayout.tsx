import { Stack } from "@mui/material";
import type { FC, ReactNode } from "react";

interface SectionLayoutProps {
  children?: ReactNode;
}

const SectionLayout: FC<SectionLayoutProps> = ({ children }) => {
  return (
    <Stack direction="column" alignItems="center">
      {children}
    </Stack>
  );
};

export default SectionLayout;
