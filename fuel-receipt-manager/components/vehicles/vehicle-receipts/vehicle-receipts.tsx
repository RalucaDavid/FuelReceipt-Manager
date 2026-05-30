"use client";

import { Dictionary } from "@/dictionaries";
import { Title, Group, Anchor } from "@mantine/core";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import useVehicles from "@/hooks/useVehicles";
import useVehicleReceipts from "@/hooks/useVehicleReceipts";
import ReceiptsContent from "@/components/receipts/receipts-content";
import classes from "./vehicle-receipts.module.css";

interface VehicleReceiptsProps {
  vehicleId: string;
}

const VehicleReceipts = ({ vehicleId }: VehicleReceiptsProps) => {
  const { vehicles } = useVehicles();
  const { receipts, isLoading, mutate } = useVehicleReceipts(vehicleId);

  const vehicle = vehicles?.find((v) => v.id === vehicleId);

  return (
    <div className={classes.page}>
      <Group mb="xs">
        <Anchor component={Link} href="/vehicles" c="dimmed" size="sm">
          <Group gap={4}>
            <IoArrowBack size={14} />
            {Dictionary.vehicles}
          </Group>
        </Anchor>
      </Group>

      <Title order={2} mb="lg">
        {vehicle
          ? [vehicle.brand, vehicle.model].filter(Boolean).join(" ") + ` · ${vehicle.licensePlate}`
          : Dictionary.receipts}
      </Title>

      <ReceiptsContent
        receipts={receipts}
        isLoading={isLoading}
        mutate={mutate}
        defaultVehicleId={vehicleId}
        readOnly
      />
    </div>
  );
};

export default VehicleReceipts;
