"use client";

import { useEffect } from "react";
import { Button } from "@/app/components/Shared/Button";
import { ErrorState } from "@/app/components/Shared/ErrorState";
import { PageShell } from "@/app/components/Shared/PageShell";

export default function WelcomePageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Welcome page error boundary caught:", error);
  }, [error]);

  return (
    <PageShell>
      <ErrorState
        title="Something went wrong"
        message="An unexpected error occurred while loading this page."
        action={<Button onClick={() => reset()}>Try again</Button>}
      />
    </PageShell>
  );
}
