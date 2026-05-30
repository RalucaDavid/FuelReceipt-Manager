"use client";

import { Dictionary } from "@/dictionaries";
import { Title, Text, Group, Anchor, Skeleton, Stack, Avatar, Paper } from "@mantine/core";
import { FaCar } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import useClientVehicleReceipts from "@/hooks/useClientVehicleReceipts";
import useClientVehicles from "@/hooks/useClientVehicles";
import useClients from "@/hooks/useClients";
import ReceiptsByMonth from "@/components/receipts/receipts-by-month";
import ExportCSV from "@/components/receipts/export-csv";
import classes from "./client-vehicle-receipts.module.css";

interface ClientVehicleReceiptsProps {
  clientId: string;
  vehicleId: string;
}

const getInitials = (firstName: string, lastName: string) =>
  `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

const ClientVehicleReceipts = ({ clientId, vehicleId }: ClientVehicleReceiptsProps) => {
  const { receipts, isLoading } = useClientVehicleReceipts(clientId, vehicleId);
  const { vehicles } = useClientVehicles(clientId);
  const { clients } = useClients();

  const client = clients?.find((c) => c.id === clientId);
  const vehicle = vehicles?.find((v) => v.id === vehicleId);

  const total = receipts?.reduce((sum, r) => sum + r.total, 0) ?? 0;

  return (
    <div className={classes.page}>
      <Anchor component={Link} href={`/clients/${clientId}`} c="dimmed" size="sm">
        <Group gap={4}>
          <IoArrowBack size={14} />
          {Dictionary.backToVehicles}
        </Group>
      </Anchor>

      <Group mt="sm" mb="lg" align="center" gap="md">
        {client && (
          <Avatar color="blue" radius="xl" size="md">
            {getInitials(client.firstName, client.lastName)}
          </Avatar>
        )}
        <div>
          {client && (
            <Text size="sm" c="dimmed">{client.firstName} {client.lastName}</Text>
          )}
          <Group gap="xs" align="center">
            <FaCar size={16} color="var(--mantine-color-blue-6)" />
            <Title order={2}>{vehicle?.licensePlate ?? ""}</Title>
          </Group>
          {vehicle && (vehicle.brand || vehicle.model) && (
            <Text size="sm" c="dimmed">
              {[vehicle.brand, vehicle.model].filter(Boolean).join(" ")}
              {vehicle.year ? ` · ${vehicle.year}` : ""}
            </Text>
          )}
        </div>
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
        <ReceiptsByMonth receipts={receipts} readOnly />
      )}
    </div>
  );
};

export default ClientVehicleReceipts;
