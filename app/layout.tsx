import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Box, Container } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { GoogleAnalytics } from "@next/third-parties/google";
import MUIConfig from "./MUIConfig";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HTTP-TO | Online HTTP Request Converter",
  description:
    "Convert raw HTTP requests to clean JavaScript Fetch code instantly. A fast, free, and secure online tool for developers to generate request snippets.",
  keywords: [
    "HTTP converter",
    "HTTP to Fetch",
    "request converter",
    "API development",
    "JavaScript Fetch",
    "online tool",
  ],
  authors: [{ name: "Alfredo Salzillo" }],
  openGraph: {
    title: "HTTP-TO | Online HTTP Request Converter",
    description:
      "Convert raw HTTP requests to clean JavaScript Fetch code instantly. A fast, free, and secure online tool for developers.",
    url: "https://alfredosalzillo.me/http-to",
    siteName: "HTTP-TO",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HTTP-TO | Online HTTP Request Converter",
    description:
      "Convert raw HTTP requests to clean JavaScript Fetch code instantly. A fast, free, and secure online tool for developers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={inter.className}>
      <AppRouterCacheProvider>
        <MUIConfig>
          <Container
            component="main"
            maxWidth="lg"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "100vh",
            }}
          >
            <Header />
            <Box sx={{ width: "100%", flex: 1 }}>{children}</Box>
            <Footer />
          </Container>
        </MUIConfig>
      </AppRouterCacheProvider>
      <GoogleAnalytics gaId="G-QZ1DYNJ6KE" />
    </body>
  </html>
);

export default RootLayout;
