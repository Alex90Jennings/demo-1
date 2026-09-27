import type { ReactNode } from "react";
import { StatusMessage } from "@/app/components/Shared/StatusMessage";

type Props = {
  title: string;
  message: string;
  action?: ReactNode;
};

export function ErrorState({ title, message, action }: Props) {
  return (
    <StatusMessage role="alert" className="max-w-sm">
      <h1 className="text-base/[22px] font-bold tracking-design text-brand">{title}</h1>
      <p className="text-sm/5 font-light tracking-design">{message}</p>
      {action}
    </StatusMessage>
  );
}
