import { Typography, useTheme } from "@mui/material";
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
      <Typography variant="h5">
        {libraryName} (
        <Link href={`${licenseLink}`} style={{ color: "#53bdff" }}>
          {licenseText}
        </Link>
        ) - {copyrightText}{" "}
        <Link
          href={`https://${repoLink}`}
          style={{ color: theme.palette.libraryText }}>
          {repoLink}
        </Link>
      </Typography>
    </>
  );
};

export default LibraryText;
