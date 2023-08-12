import { Typography } from "@mui/material";
import Header from "../components/common/Header";
import LandingContainer from "../components/landing/LandingContainer";
import LibraryText from "../components/LibraryText";

const CookiePolicy = () => {
  return (
    <>
      <Header title="Credits" index={false} />
      <LandingContainer>
        <Typography variant="h4">Credits</Typography>
        <LibraryText
          libraryName="React"
          repoLink="github.com/facebook/react"
          copyrightText="Copyright (c) Meta Platforms, Inc. and affiliates."
          licenseText="MIT License"
          licenseLink="https://github.com/facebook/react/blob/main/LICENSE"
        />
        <LibraryText
          libraryName="Next.js"
          repoLink="github.com/vercel/next.js"
          copyrightText="Copyright (c) 2023 Vercel, Inc."
          licenseText="MIT License"
          licenseLink="https://github.com/vercel/next.js/blob/canary/license.md"
        />
        <LibraryText
          libraryName="NextAuth.js"
          repoLink="github.com/nextauthjs/next-auth"
          copyrightText="Copyright (c) 2022-2023, Balázs Orbán"
          licenseText="ISC License"
          licenseLink="https://github.com/nextauthjs/next-auth/blob/main/LICENSE"
        />
        <LibraryText
          libraryName="Prisma"
          repoLink="github.com/prisma/prisma"
          copyrightText="Copyright [yyyy] [name of copyright owner]"
          licenseText="Apache License 2.0"
          licenseLink="https://github.com/prisma/prisma/blob/main/LICENSE"
        />
        <LibraryText
          libraryName="Zod"
          repoLink="github.com/colinhacks/zod"
          copyrightText="Copyright (c) 2020 Colin McDonnell"
          licenseText="MIT License"
          licenseLink="https://github.com/colinhacks/zod/blob/master/LICENSE"
        />
        <LibraryText
          libraryName="Material UI"
          repoLink="github.com/mui/material-ui"
          copyrightText="Copyright (c) 2014 Call-Em-All"
          licenseText="MIT License"
          licenseLink="https://github.com/mui/material-ui/blob/master/LICENSE"
        />
        <LibraryText
          libraryName="React Hook Form"
          repoLink="github.com/react-hook-form/resolvers"
          copyrightText="
            Copyright (c) 2019-present Beier(Bill) Luo"
          licenseText="MIT License"
          licenseLink="https://github.com/react-hook-form/resolvers/blob/master/LICENSE"
        />
        <LibraryText
          libraryName="emotion"
          repoLink="github.com/emotion-js/emotion"
          copyrightText="Copyright (c) Emotion team and other contributors"
          licenseText="MIT License"
          licenseLink="https://github.com/emotion-js/emotion/blob/main/LICENSE"
        />
        <LibraryText
          libraryName="superjson"
          repoLink="github.com/blitz-js/superjson"
          copyrightText="Copyright (c) 2020 Simon Knott and superjson contributors"
          licenseText="MIT License"
          licenseLink="https://github.com/blitz-js/superjson/blob/main/LICENSE"
        />
        <LibraryText
          libraryName="jotai"
          repoLink="github.com/pmndrs/jotai"
          copyrightText="Copyright (c) 2020-2023 Poimandres"
          licenseText="MIT License"
          licenseLink="https://github.com/pmndrs/jotai/blob/main/LICENSE"
        />
      </LandingContainer>
    </>
  );
};

export default CookiePolicy;
