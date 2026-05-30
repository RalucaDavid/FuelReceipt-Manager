"use client";

import { use } from "react";
import VehicleReceipts from "@/components/vehicles/vehicle-receipts";

export default function VehicleReceiptsPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>;
}) {
  const { vehicleId } = use(params);
  return <VehicleReceipts vehicleId={vehicleId} />;
}
