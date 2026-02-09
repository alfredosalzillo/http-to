"use client";
import type { FC } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Box, Container, Divider, Link, Typography } from "@mui/material";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ width: "100%", mt: "auto", py: 4 }}>
      <Divider sx={{ mb: 2 }} />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} HTTP-TO. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Link
              href="https://github.com/alfredosalzillo/http-to"
              underline="hover"
              color="inherit"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                transition: "color 0.2s",
                "&:hover": { color: "primary.main" },
              }}
            >
              <GitHubIcon fontSize="small" />
              <Typography variant="body2">GitHub</Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
