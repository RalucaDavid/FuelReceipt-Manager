"use client";

import { use } from "react";
import ClientVehicleReceipts from "@/components/clients/client-vehicle-receipts";

export default function ClientVehicleReceiptsPage({
  params,
}: {
  params: Promise<{ clientId: string; vehicleId: string }>;
}) {
  const { clientId, vehicleId } = use(params);
  return <ClientVehicleReceipts clientId={clientId} vehicleId={vehicleId} />;
}
