"use client";

import { useState } from "react";
import { Dictionary } from "@/dictionaries";
import {
  Title, Text, Group, Anchor, Button, Skeleton,
  Stack, Paper, Avatar,
} from "@mantine/core";
import { FaCar } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import useVehicles from "@/hooks/useVehicles";
import useVehicleReceipts from "@/hooks/useVehicleReceipts";
import { deleteReceipt } from "@/api/receipts";
import ReceiptsByMonth from "@/components/receipts/receipts-by-month";
import ExportCSV from "@/components/receipts/export-csv";
import ReceiptModal from "@/components/modals/receipt-modal";
import { ReceiptResponseDTO } from "@/types/receipts";
import classes from "./vehicle-receipts.module.css";

interface VehicleReceiptsProps {
  vehicleId: string;
}

const VehicleReceipts = ({ vehicleId }: VehicleReceiptsProps) => {
  const { vehicles } = useVehicles();
  const { receipts, isLoading, mutate } = useVehicleReceipts(vehicleId);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptResponseDTO | undefined>(undefined);
  const [opened, { open, close }] = useDisclosure(false);

  const vehicle = vehicles?.find((v) => v.id === vehicleId);
  const total = receipts?.reduce((sum, r) => sum + r.total, 0) ?? 0;

  const handleDelete = async (receiptId: string) => {
    try {
      await deleteReceipt(receiptId);
      mutate();
      notifications.show({ title: Dictionary.success, message: Dictionary.theReceiptHasBeenDeleted, color: "green" });
    } catch {
      notifications.show({ title: Dictionary.error, message: Dictionary.theReceiptCouldNotBeDeleted, color: "red" });
    }
  };

  const handleOpenEdit = (receipt: ReceiptResponseDTO) => {
    setSelectedReceipt(receipt);
    open();
  };

  const handleOpenCreate = () => {
    setSelectedReceipt(undefined);
    open();
  };

  return (
    <div className={classes.page}>
      <Anchor component={Link} href="/vehicles" c="dimmed" size="sm">
        <Group gap={4}>
          <IoArrowBack size={14} />
          {Dictionary.myVehicles}
        </Group>
      </Anchor>

      <Group mt="sm" mb="lg" justify="space-between" align="flex-start">
        <Group align="center" gap="sm">
          <Avatar color="blue" radius="md" size="lg">
            <FaCar size={22} />
          </Avatar>
          <div>
            <Title order={2}>{vehicle?.licensePlate ?? ""}</Title>
            {vehicle && (vehicle.brand || vehicle.model) && (
              <Text size="sm" c="dimmed">
                {[vehicle.brand, vehicle.model].filter(Boolean).join(" ")}
                {vehicle.year ? ` · ${vehicle.year}` : ""}
              </Text>
            )}
          </div>
        </Group>
        <Button onClick={handleOpenCreate}>{Dictionary.addNewReceipt}</Button>
      </Group>

      {!isLoading && receipts && receipts.length > 0 && (
        <Group mb="lg" justify="space-between" align="flex-start">
          <Group gap="md">
            <Paper withBorder p="sm" radius="md" className={classes.statCard}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>{Dictionary.totalReceipts}</Text>
              <Text size="xl" fw={700}>{receipts.length}</Text>
            </Paper>
            <Paper withBorder p="sm" radius="md" className={classes.statCard}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>{Dictionary.totalSpent}</Text>
              <Text size="xl" fw={700} c="blue">{total.toFixed(2)} RON</Text>
            </Paper>
          </Group>
          <ExportCSV
            receipts={receipts}
            filename={`${vehicle?.licensePlate ?? "vehicle"}-receipts.csv`}
          />
        </Group>
      )}

      {isLoading && (
        <Stack gap="xs">
          <Skeleton height={48} radius="sm" />
          <Skeleton height={48} radius="sm" />
          <Skeleton height={48} radius="sm" />
        </Stack>
      )}

      {!isLoading && receipts?.length === 0 && (
        <Text c="dimmed">{Dictionary.thereAreNoReceipts}</Text>
      )}

      {!isLoading && receipts && receipts.length > 0 && (
        <ReceiptsByMonth
          receipts={receipts}
          onUpdate={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      <ReceiptModal
        receipt={selectedReceipt}
        opened={opened}
        onClose={close}
        onSuccess={() => mutate()}
        defaultVehicleId={vehicleId}
      />
    </div>
  );
};

export default VehicleReceipts;
