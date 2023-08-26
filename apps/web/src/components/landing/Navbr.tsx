import { Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import { SiDiscogs, SiDiscord, SiTwitch } from "react-icons/si";

const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [navbarIsMoveing, setNavbarIsMoveing] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrollPosition > 0) {
      setNavbarIsMoveing(true);
    } else {
      setNavbarIsMoveing(false);
    }
  }, [scrollPosition]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          height="650px"
          sx={{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            top: "50%",
            left: "50%",
            maxWidth: "960px",
            width: "100%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
          }}>
          <Stack bgcolor="#20AB8C" maxWidth="480px" width="100%" height="100%">
            <Typography
              color="#ECFFFA"
              fontSize="32px"
              fontWeight="bold"
              textAlign="center"
              padding="20px">
              LOGO OR MASCOT
            </Typography>
          </Stack>
          <Stack
            bgcolor="black"
            maxWidth="480px"
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
            p="70px">
            <Typography
              width="100%"
              color="#ECFFFA"
              fontSize="32px"
              fontWeight="bold"
              textAlign="start">
              Log In
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              width="100%"
              mt="30px">
              <Button
                variant="contained"
                sx={{
                  color: "#ECFFFA",
                  bgcolor: "transparent",
                  border: "1px solid #ECFFFA",
                }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SiTwitch />
                  <Typography>Twitch</Typography>
                </Stack>
              </Button>
              <Button
                variant="contained"
                sx={{
                  color: "#ECFFFA",
                  bgcolor: "transparent",
                  border: "1px solid #ECFFFA",
                }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SiDiscord />
                  <Typography>Discord</Typography>
                </Stack>
              </Button>
            </Stack>
            <Stack direction="row" alignItems="center" mt="30px">
              <input type="checkbox" />
              <Typography color="#666C71">
                I agree to
                <Link href="#" style={{ color: "#20AB8C" }}>
                  {" "}
                  Cookie Policy
                </Link>
                ,
                <Link href="#" style={{ color: "#20AB8C" }}>
                  {" "}
                  Privacy Policy
                </Link>
                ,
                <Link href="#" style={{ color: "#20AB8C" }}>
                  {" "}
                  Terms of Use
                </Link>
                , and
                <Link href="#" style={{ color: "#20AB8C" }}>
                  {" "}
                  EULA
                </Link>
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Modal>
      <Stack
        position="fixed"
        zIndex={100}
        left={0}
        onScroll={handleScroll}
        width="100%"
        height="115px"
        alignItems="center"
        justifyContent="center"
        bgcolor={navbarIsMoveing ? "#ECFFFA" : "transparent"}
        sx={
          navbarIsMoveing
            ? {
                borderBottomColor: "rgba(102, 108, 113, 0.5)",
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
              }
            : null
        }>
        <Stack
          display="flex"
          direction="row"
          width="100%"
          maxWidth="1440px"
          justifyContent="space-between">
          <Link
            href="/"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <img
                style={{ borderRadius: "10px", marginLeft: "5px" }}
                src="https://avatars.githubusercontent.com/u/125701962?s=200&v=4"
                height={40}
                width={40}
                alt="logo"
              />
              <Typography color="#20AB8C" fontSize="24px" fontWeight="bold">
                Senchabot
              </Typography>
            </Stack>
          </Link>
          <Stack
            fontSize={18}
            direction="row"
            alignItems="center"
            color="#0B0E15"
            spacing="48px"
            fontWeight="bold">
            <Link href="/features">Features</Link>
            <Link href="/support">Support</Link>
            <Link href="/documentation">Documentation</Link>
          </Stack>
          <Button
            onClick={handleOpen}
            sx={{
              bgcolor: "#20AB8C",
              color: "#ECFFFA",
              padding: "13px 20px",
              borderRadius: "10px",
              ":hover": {
                mt: "0px",
                bgcolor: "#003B43",
              },
            }}>
            Login
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default Navbar;
