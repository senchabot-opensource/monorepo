import { Button, Stack, Typography } from "@mui/material";
import SectionLayout from "../layout/SectionLayout";
import { BsDiscord } from "react-icons/bs";

const FooterUpper = () => {
  return (
    <SectionLayout>
      <Stack
        direction="row"
        bgcolor="#003B43"
        height="155px"
        width="100%"
        justifyContent="center">
        <Stack
          direction="row"
          maxWidth="1440px"
          width="100%"
          alignItems="center"
          justifyContent="space-between">
          <Stack color="#ECFFFA">
            <Typography fontSize="32px" fontWeight={700}>
              And so much more!
            </Typography>
            <Typography fontWeight={300}>
              No payment, or download required.
            </Typography>
          </Stack>
          <Stack>
            <Button
              variant="contained"
              sx={{
                color: "#ECFFFA",
                fontWeight: 500,
                borderRadius: "8px",
                bgcolor: "#20AB8C",
                padding: "15px 64px",
              }}>
              Login with Twitch
            </Button>
            <Stack
              mt="8px"
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Typography>Also log in:</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <BsDiscord size={28} color="#ECFFFA" />
                <Typography fontWeight="bold">Discord</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </SectionLayout>
  );
};

export default FooterUpper;
