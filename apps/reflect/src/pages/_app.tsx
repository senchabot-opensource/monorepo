import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
import type { Session } from "next-auth";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import {
  ColorModeProvider,
  ColorModeContext,
} from "src/Context/ColorModeContext";
import { useContext, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { getDesignTokens, getThemedComponents } from "src/utils/theme";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { colorMode } = useContext(ColorModeContext);

  const theme = useMemo(
    () =>
      createTheme(getDesignTokens(colorMode), getThemedComponents(colorMode)),
    [colorMode],
  );
  return (
    <>
      <ColorModeProvider>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-0N948SR48C`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-0N948SR48C');
      `}
        </Script>
        <SessionProvider
          session={session}
          refetchInterval={60 * 60}
          refetchOnWindowFocus={false}>
          <Component {...pageProps} />
        </SessionProvider>
        <Analytics />
      </ColorModeProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
