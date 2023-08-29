import { Typography } from "@mui/material";
import Header from "../components/common/Header";
import LandingContainer from "../components/landing/LandingContainer";

const CookiePolicy = () => {
  return (
    <>
      <Header title="Privacy Policy" index={false}></Header>
      <LandingContainer>
        <Typography variant="h4">Privacy Policy for Senchabot</Typography>
        <Typography variant="h5">
          At Senchabot, we take your privacy seriously. This policy outlines how
          we collect, use, and share your personal information.
        </Typography>
        <Typography variant="h5" sx={{ paddingTop: "20px" }}>
          Information We Collect:
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          - User IDs, names and emails on Discord and Twitch
        </Typography>
        <Typography variant="h6">
          - Messages and commands sent to Senchabot
        </Typography>
        <Typography variant="h6">
          -Usage statistics, including time and frequency of use
        </Typography>
        <Typography variant="h5" sx={{ paddingTop: "20px" }}>
          How We Use Your Information:
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          -To provide and improve Senchabot&lsquo;s services
        </Typography>
        <Typography variant="h6">
          -To respond to user inquiries and support requests
        </Typography>
        <Typography variant="h6">
          -To monitor and analyze the performance of Senchabot
        </Typography>
        <Typography variant="h5" sx={{ paddingTop: "20px" }}>
          Information Sharing:
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          - We do not sell or rent your personal information to third parties.
        </Typography>
        <Typography variant="h6">
          - We may share your information with service providers who assist us
          in operating Senchabot.
        </Typography>
        <Typography variant="h6">
          - We may also disclose your information as required by law or to
          comply with legal process.
        </Typography>
        <Typography variant="h5" sx={{ paddingTop: "20px" }}>
          Security:
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          - We take reasonable measures to protect your personal information
          from unauthorized access, use, or disclosure.
        </Typography>
        <Typography variant="h5" sx={{ paddingTop: "20px" }}>
          Data Retention:
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          - We will retain your personal information for as long as necessary to
          provide Senchabot&lsquo;s services or as required by law.
        </Typography>
        <Typography variant="h5" sx={{ paddingTop: "20px" }}>
          Changes to this Policy:
        </Typography>
        <Typography variant="h6" sx={{ paddingTop: "10px" }}>
          - We may update this policy from time to time. The updated policy will
          be posted on Senchabot&lsquo;s website.
        </Typography>
      </LandingContainer>
    </>
  );
};

export default CookiePolicy;
