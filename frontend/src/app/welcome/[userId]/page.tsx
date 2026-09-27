"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import type { NextDeliveryComms } from "@/types";
import { FetchError, fetchJSON } from "@/lib/swr-helper";
import { NextDeliveryCard } from "@/app/components/Welcome/NextDeliveryCard";
import { ErrorState } from "@/app/components/Shared/ErrorState";
import { PageShell } from "@/app/components/Shared/PageShell";
import { StatusMessage } from "@/app/components/Shared/StatusMessage";

function errorContent(error: Error): { title: string; message: string } {
  if (error instanceof FetchError && error.code === "NO_ACTIVE_SUBSCRIPTIONS") {
    return {
      title: "No upcoming delivery",
      message: "There are no active subscriptions on this account, so there's no delivery scheduled.",
    };
  }
  if (error instanceof FetchError && error.status === 404) {
    return {
      title: "Customer not found",
      message: "We couldn't find that customer. Please check the link and try again.",
    };
  }
  return {
    title: "Something went wrong",
    message: "We couldn't load your delivery details. Please try again later.",
  };
}

export default function WelcomePage() {
  const { userId } = useParams<{ userId: string }>();

  const { data, error, isLoading } = useSWR<NextDeliveryComms, Error>(
    `/api/comms/your-next-delivery/${encodeURIComponent(userId)}`,
    fetchJSON,
    { revalidateOnFocus: false },
  );

  if (isLoading) {
    return (
      <PageShell>
        <StatusMessage aria-live="polite">Loading…</StatusMessage>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <ErrorState {...errorContent(error)} />
      </PageShell>
    );
  }

  return <PageShell>{data && <NextDeliveryCard comms={data} />}</PageShell>;
}
