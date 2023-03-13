import { Typography } from "@mui/material";
import Link from "next/link";
import { Offset } from "./Offset";

interface ILibraryTextParams {
  libraryName: string;
  repoLink: string;
  copyrightText: string;
  library: string;
}

const LibraryText = (params: ILibraryTextParams) => {
  return (
    <>
      <Offset />
      <Typography variant="h5">
        {params.libraryName} ({params.library}) - {params.copyrightText}{" "}
        <Link href={`https://${params.repoLink}`} style={{ color: "#ffff00" }}>
          {params.repoLink}
        </Link>
      </Typography>
    </>
  );
};

export default LibraryText;
