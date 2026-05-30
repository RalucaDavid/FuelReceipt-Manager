"use client";

import { use } from "react";
import ClientVehicles from "@/components/clients/client-vehicles";

export default function ClientVehiclesPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = use(params);
  return <ClientVehicles clientId={clientId} />;
}
