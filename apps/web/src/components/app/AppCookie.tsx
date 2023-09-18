import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SnackbarContent from "@mui/material/SnackbarContent";
import Link from "next/link";

// const action = (
//   <Button
//     color="secondary"
//     size="small"
//     sx={{
//       border: 1,
//       borderColor: "#4db8ff",
//       color: "#1aa3ff",
//       paddingX: ".8rem",
//       paddingY: ".4rem",
//     }}>
//     ACCEPT
//   </Button>
// );

export default function LongTextSnackbar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isButtonClicked = localStorage.getItem("buttonClicked");
    console.log(typeof isButtonClicked);

    if (!isButtonClicked) {
      setIsVisible(true);
    }
  }, []);

  const handleButtonClick = () => {
    setIsVisible(false);
    localStorage.setItem("buttonClicked", "true");
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 600 }}>
      {isVisible && (
        <SnackbarContent
          message={
            <>
              By using this site, you agree to our{" "}
              <Link href="/privacy-policy" style={{ color: "#1aa3ff" }}>
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" style={{ color: "#1aa3ff" }}>
                Terms of Service
              </Link>
              <Button
                color="secondary"
                size="small"
                sx={{
                  border: 1,
                  borderColor: "#4db8ff",
                  color: "#1aa3ff",
                  paddingX: ".8rem",
                  paddingY: ".4rem",
                  marginLeft: "1rem",
                }}
                onClick={handleButtonClick}>
                ACCEPT
              </Button>
            </>
          }
        />
      )}
    </Stack>
  );
}
