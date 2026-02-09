import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Box, Container, Link, Typography } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import MUIConfig from "./MUIConfig";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HTTP-TO - Online HTTP request converter",
  description: "Convert HTTP requests to javascript fetch, dart request",
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
              justifyContent: "space-between",
              alignItems: "center",
              gap: 3,
              py: 3,
              minHeight: "100vh",
            }}
          >
            <Box component="header" sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                HTTP-TO
              </Typography>
              <Typography variant="subtitle1">HTTP request converter</Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
              {children}
            </Box>
            <Box component="footer">
              <Link
                href="https://github.com/alfredosalzillo/http-to"
                underline="hover"
                color="inherit"
                target="_blank"
              >
                github
              </Link>
            </Box>
          </Container>
        </MUIConfig>
      </AppRouterCacheProvider>
    </body>
  </html>
);

export default RootLayout;
