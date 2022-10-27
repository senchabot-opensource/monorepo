import React from "react";
/*import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";*/
import { Stack, Typography, Divider, alpha } from "@mui/material";
//import { blue } from "@mui/material/colors";

import LinkAccount from "../components/auth/LinkAccount";
import { trpc } from "../utils/trpc";
import { capitalizeWord } from "../utils/functions";
import { useSession } from "next-auth/react";
import FormTitle from "../components/FormTitle";

/*const _Button = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(blue[500]),
  backgroundColor: alpha("#000", 0.8),
  "&:hover": {
    backgroundColor: alpha("#fff", 0.1),
  },
}));*/

const SecurityForm = () => {
  const { data: session } = useSession();
  const email = session?.user?.email || null || undefined;
  const [isLoading, setIsLoading] = React.useState(true);
  const accounts = trpc.security.getAccounts.useQuery();

  const [showEmailAddress, setShowEmailAddress] = React.useState(false);

  React.useEffect(() => {
    if (!accounts.isLoading) setIsLoading(false);
  }, [accounts.isLoading]);

  return (
    <>
      <FormTitle titleText="Link Account" />

      <Stack
        spacing={2}
        direction="row"
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        <LinkAccount />
      </Stack>

      <Stack direction="column" sx={{ display: { xs: "flex", md: "none" } }}>
        <LinkAccount />
      </Stack>

      <Stack spacing={0.5} direction="column" sx={{ mt: 2 }}>
        <Typography>
          Linked accounts:{" "}
          {isLoading
            ? "Loading..."
            : accounts.data?.map(
                (account, index) =>
                  accounts &&
                  (accounts.data && accounts.data.length - 1 === index
                    ? (index > 2 ? "and " : "") +
                      capitalizeWord(account.provider)
                    : capitalizeWord(account.provider) +
                      (index < 2 ? " and " : ", "))
              )}
        </Typography>
        <Typography>
          Your e-mail address:
          {showEmailAddress && email
            ? email.substring(email?.length / 2, email?.length)
            : "***"}{" "}
          <button onClick={() => setShowEmailAddress(!showEmailAddress)}>
            Show/Hide
          </button>
        </Typography>
      </Stack>

      <Divider
        orientation="horizontal"
        flexItem
        sx={{ mt: 2, mb: 2, width: "100%" }}
      />
    </>
  );
};

export default SecurityForm;
