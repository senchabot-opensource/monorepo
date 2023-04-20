import { Typography } from "@mui/material";
import Header from "../components/common/Header";
import LandingContainer from "../components/landing/LandingContainer";

const CookiePolicy = () => {
  return (
    <>
      <Header title="Cookie Policy" index={false}></Header>
      <LandingContainer>
        <Typography variant="h4">Cookie Policy for Senchabot</Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          Senchabot uses cookies to enhance the user experience and improve the
          performance of the bot. By using Senchabot, you consent to the use of
          cookies in accordance with this policy.
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          Cookies are small text files that are placed on your device when you
          use Senchabot. They allow Senchabot to remember your preferences and
          help us analyze how you use the bot. This information is used to
          improve the user experience and provide better services.
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          Senchabot uses both session cookies and persistent cookies. Session
          cookies are temporary and are deleted when you close your browser,
          while persistent cookies remain on your device until they expire or
          you delete them.
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          You can control the use of cookies at the individual browser level. If
          you choose to disable cookies, some features of Senchabot may not
          function properly.
        </Typography>
      </LandingContainer>
    </>
  );
};

export default CookiePolicy;
