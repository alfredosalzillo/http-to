"use client";

import type React from "react";
import { useState } from "react";
import clsx from "clsx";
import classes from "./CopyButton.module.scss";

export type CopyButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  value: string;
};
const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  className,
  ...props
}) => {
  const [status, setStatus] = useState<"idle" | "waiting" | "done">("idle");
  return (
    <button
      type="button"
      disabled={status !== "idle"}
      {...props}
      className={clsx(classes.root, className)}
      onClick={async () => {
        setStatus("waiting");
        await navigator.clipboard.writeText(value);
        setStatus("done");
        setTimeout(() => {
          setStatus("idle");
        }, 1000);
      }}
    >
      {status === "done" && "COPIED"}
      {status === "idle" && "COPY"}
      {status === "waiting" && "COPY"}
    </button>
  );
};

export default CopyButton;
