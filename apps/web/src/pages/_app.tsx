import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
import type { Session } from "next-auth";
import "../styles/globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { ColorModeProvider } from "src/Context/ColorModeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false } },
      }),
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
        <QueryClientProvider client={queryClient}>
          <SessionProvider
            session={session}
            refetchInterval={60 * 60}
            refetchOnWindowFocus={false}>
            <Component {...pageProps} />
          </SessionProvider>
          <Analytics />
        </QueryClientProvider>
      </ColorModeProvider>
    </>
  );
};

export default MyApp;
