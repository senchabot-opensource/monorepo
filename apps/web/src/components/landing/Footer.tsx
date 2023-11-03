import { Stack, Typography } from "@mui/material";
import SectionLayout from "./layout/SectionLayout";

const Footer = () => {
  return (
    <SectionLayout>
      <Stack
        p={2}
        direction="row"
        alignItems="center"
        justifyContent="center"
        height="64px"
        width="100%"
        bgcolor="rgba(102, 108, 113, 0.10)">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          maxWidth="1440px"
          color="#0B0E15"
          spacing={2}>
          <Typography>© 2023 Senchabot | All Rights Reserved.</Typography>
          <img
            height={36}
            width={36}
            src="https://avatars.githubusercontent.com/u/125701962?s=200&v=4"
            alt="Senchabot"
            style={{ borderRadius: "8px" }}
          />
          <Typography>Made with ❤️ from the community.</Typography>
        </Stack>
      </Stack>
    </SectionLayout>
  );
};

export default Footer;
