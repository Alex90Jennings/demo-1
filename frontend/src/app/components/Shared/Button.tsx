import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const base =
  "inline-flex min-h-[31px] cursor-pointer items-center justify-center whitespace-nowrap rounded border border-brand px-3 text-xs/[22px] font-semibold tracking-design uppercase transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none [@media(pointer:coarse)]:min-h-11";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-surface hover:border-brand-hover hover:bg-brand-hover",
  secondary: "bg-transparent text-brand hover:bg-brand/5",
};

export function Button({ variant = "primary", className, type = "button", ...rest }: Props) {
  const classes = [base, variants[variant], className].filter(Boolean).join(" ");
  return <button type={type} className={classes} {...rest} />;
}
