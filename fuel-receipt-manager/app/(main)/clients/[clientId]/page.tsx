"use client";

import { use } from "react";
import ClientReceipts from "@/components/clients/client-receipts";

export default function ClientReceiptsPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = use(params);
  return <ClientReceipts clientId={clientId} />;
}
