import { Stack, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { Offset } from "./Offset";
import { FC } from "react";

type IProps = {
  libraryName: string;
  repoLink: string;
  copyrightText: string;
  licenseText: string;
  licenseLink: string;
};

const LibraryText: FC<IProps> = ({
  libraryName,
  licenseText,
  copyrightText,
  licenseLink,
  repoLink,
}) => {
  const theme = useTheme();

  return (
    <>
      <Offset />
      <Stack></Stack>
      <Typography variant="h5">
        {libraryName}(
        <Link
          href={`${licenseLink}`}
          style={{
            color: "#0B0E15",
            textDecoration: "underline",
            fontWeight: "500",
          }}>
          {licenseText})
        </Link>
      </Typography>
      <Typography>
        {copyrightText}{" "}
        <Link
          href={`https://${repoLink}`}
          style={{
            color: "#20AB8C",
          }}>
          {repoLink}
        </Link>
      </Typography>
    </>
  );
};

export default LibraryText;
