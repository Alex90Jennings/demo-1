import type { HTMLAttributes } from "react";

export function StatusMessage({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const classes = ["mt-12 space-y-3 text-center text-sm/5 md:mt-0", className]
    .filter(Boolean)
    .join(" ");
  return <div className={classes} {...rest} />;
}
