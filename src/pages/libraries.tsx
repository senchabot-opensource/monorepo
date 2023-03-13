import { CssBaseline, Grid, ThemeProvider, Typography } from "@mui/material";
import { AppHeader } from "../components/app";
import LandingAppBar from "../components/landing/LandingAppBar";
import LibraryText from "../components/LibraryText";
import { landingDarkTheme } from "../utils/theme";

const CookiePolicy = () => {
  return (
    <>
      <AppHeader title="Open Source Libraries" index={false}></AppHeader>
      <ThemeProvider theme={landingDarkTheme}>
        <CssBaseline />

        <LandingAppBar />

        <Grid
          container
          direction="column"
          justifyContent="flex-end"
          sx={{
            pl: { xs: "10px", md: "16vh" },
            pr: { xs: "none", md: "16vh" },
            pb: { xs: "4px", md: "128px" },
            overflowWrap: "break-word",
            whiteSpace: "pre-line",
          }}
        >
          {" "}
          <Typography variant="h4">Open Source Libraries</Typography>
          <LibraryText
            libraryName="React"
            repoLink="github.com/facebook/react"
            copyrightText="Copyright (c) Meta Platforms, Inc. and affiliates."
            library="MIT License"
          />
          <LibraryText
            libraryName="Next.js"
            repoLink="github.com/vercel/next.js"
            copyrightText="Copyright (c) 2023 Vercel, Inc."
            library="MIT License"
          />
          <LibraryText
            libraryName="NextAuth.js"
            repoLink="github.com/nextauthjs/next-auth"
            copyrightText="Copyright (c) 2022-2023, Balázs Orbán"
            library="ISC License"
          />
          <LibraryText
            libraryName="Prisma"
            repoLink="github.com/prisma/prisma"
            copyrightText="Copyright [yyyy] [name of copyright owner]"
            library="Apache License 2.0"
          />
          <LibraryText
            libraryName="tRPC"
            repoLink="github.com/trpc/trpc"
            copyrightText="Copyright (c) 2023 Alex Johansson"
            library="MIT License"
          />
          <LibraryText
            libraryName="Zod"
            repoLink="github.com/colinhacks/zod"
            copyrightText="Copyright (c) 2020 Colin McDonnell"
            library="MIT License"
          />
          <LibraryText
            libraryName="Material UI"
            repoLink="github.com/mui/material-ui"
            copyrightText="Copyright (c) 2014 Call-Em-All"
            library="MIT License"
          />
          <LibraryText
            libraryName="React Hook Form"
            repoLink="github.com/react-hook-form/resolvers"
            copyrightText="
            Copyright (c) 2019-present Beier(Bill) Luo"
            library="MIT License"
          />
          <LibraryText
            libraryName="emotion"
            repoLink="github.com/emotion-js/emotion"
            copyrightText="Copyright (c) Emotion team and other contributors"
            library="MIT License"
          />
          <LibraryText
            libraryName="superjson"
            repoLink="github.com/blitz-js/superjson"
            copyrightText="Copyright (c) 2020 Simon Knott and superjson contributors"
            library="MIT License"
          />
        </Grid>
        <Typography sx={{ position: "fixed", bottom: 16, right: 16 }}>
          pre-alpha
        </Typography>
      </ThemeProvider>
    </>
  );
};

export default CookiePolicy;
