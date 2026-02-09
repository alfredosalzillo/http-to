"use client";

import type React from "react";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Button, type ButtonProps } from "@mui/material";

export type CopyButtonProps = ButtonProps & {
  value: string;
};
const CopyButton: React.FC<CopyButtonProps> = ({ value, sx, ...props }) => {
  const [status, setStatus] = useState<"idle" | "waiting" | "done">("idle");
  return (
    <Button
      disabled={status !== "idle"}
      startIcon={status === "done" ? <CheckIcon /> : <ContentCopyIcon />}
      {...props}
      onClick={async () => {
        setStatus("waiting");
        await navigator.clipboard.writeText(value);
        setStatus("done");
        setTimeout(() => {
          setStatus("idle");
        }, 1000);
      }}
    >
      {status === "done" ? "COPIED" : "COPY"}
    </Button>
  );
};

export default CopyButton;
