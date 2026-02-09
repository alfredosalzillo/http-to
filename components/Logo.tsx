import CodeIcon from "@mui/icons-material/Code";
import { Box, Typography } from "@mui/material";

const Logo = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        color: "primary.main",
      }}
    >
      <CodeIcon sx={{ fontSize: 40 }} />
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 800,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          background: (theme) =>
            `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        HTTP-TO
      </Typography>
    </Box>
  );
};

export default Logo;
