import { Stack, Typography } from "@mui/material";
import DeleteAccount from "../components/button/DeleteAccount";

const PrivacyForm = () => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Delete Account
      </Typography>
      <Stack
        spacing={2}
        direction="row"
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        <DeleteAccount />
      </Stack>
      <Stack
        spacing={2}
        direction="column"
        sx={{ display: { xs: "flex", md: "none" } }}
      >
        <DeleteAccount />
      </Stack>
    </>
  );
};

export default PrivacyForm;
