import { Stack } from "@mui/material";
import DeleteAccount from "../components/button/DeleteAccount";
import FormTitle from "../components/FormTitle";

const PrivacyForm = () => {
  return (
    <>
      <FormTitle titleText="Delete Account" />
      <Stack
        spacing={2}
        direction="row"
        sx={{ display: { xs: "none", md: "flex" } }}>
        <DeleteAccount />
      </Stack>
      <Stack
        spacing={2}
        direction="column"
        sx={{ display: { xs: "flex", md: "none" } }}>
        <DeleteAccount />
      </Stack>
    </>
  );
};

export default PrivacyForm;
