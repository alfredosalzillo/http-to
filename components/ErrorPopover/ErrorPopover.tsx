"use client";

import { type FC, useState } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import { Alert, IconButton, Popover } from "@mui/material";

type ErrorPopoverProps = {
  error: Error;
};

const ErrorPopover: FC<ErrorPopoverProps> = ({ error }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "error-popover" : undefined;

  return (
    <>
      <IconButton color="error" onClick={handleClick}>
        <ErrorIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Alert severity="error">{error.message}</Alert>
      </Popover>
    </>
  );
};

export default ErrorPopover;
