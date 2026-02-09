"use client";
import type { FC } from "react";
import { Box, Typography } from "@mui/material";
import Logo from "@/components/Logo";

const Header: FC = () => {
  return (
    <Box
      component="header"
      sx={{
        textAlign: "center",
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Logo />
      <Typography
        variant="subtitle1"
        sx={{
          color: "text.secondary",
          fontWeight: 500,
          maxWidth: "400px",
        }}
      >
        Convert HTTP requests to clean code in seconds
      </Typography>
    </Box>
  );
};

export default Header;
