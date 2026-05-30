"use client";

import { Dictionary } from "@/dictionaries";
import {
  Title, Text, Group, Anchor, Skeleton, Stack,
  Avatar, Card, Badge,
} from "@mantine/core";
import { FaCar } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import useClients from "@/hooks/useClients";
import useClientVehicles from "@/hooks/useClientVehicles";
import classes from "./client-vehicles.module.css";

interface ClientVehiclesProps {
  clientId: string;
}

const getInitials = (firstName: string, lastName: string) =>
  `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

const ClientVehicles = ({ clientId }: ClientVehiclesProps) => {
  const { clients } = useClients();
  const { vehicles, isLoading } = useClientVehicles(clientId);

  const client = clients?.find((c) => c.id === clientId);

  return (
    <div className={classes.page}>
      <Anchor component={Link} href="/clients" c="dimmed" size="sm">
        <Group gap={4}>
          <IoArrowBack size={14} />
          {Dictionary.backToClients}
        </Group>
      </Anchor>

      <Group mt="sm" mb="lg" align="center">
        {client && (
          <Avatar color="blue" radius="xl" size="lg">
            {getInitials(client.firstName, client.lastName)}
          </Avatar>
        )}
        <div>
          <Title order={2}>
            {client ? `${client.firstName} ${client.lastName}` : ""}
          </Title>
          {client && (
            <Text size="sm" c="dimmed">{client.email}</Text>
          )}
        </div>
      </Group>

      {isLoading && (
        <Stack gap="sm">
          <Skeleton height={72} radius="md" />
          <Skeleton height={72} radius="md" />
          <Skeleton height={72} radius="md" />
        </Stack>
      )}

      {!isLoading && vehicles?.length === 0 && (
        <Text c="dimmed">{Dictionary.noVehiclesYet}</Text>
      )}

      {!isLoading && vehicles && vehicles.length > 0 && (
        <Stack gap="sm">
          {vehicles.map((vehicle) => (
            <Anchor
              key={vehicle.id}
              component={Link}
              href={`/clients/${clientId}/${vehicle.id}`}
              underline="never"
            >
              <Card withBorder radius="md" className={classes.vehicleCard}>
                <Group justify="space-between">
                  <Group gap="sm">
                    <Avatar color="blue" radius="md" size="md">
                      <FaCar size={18} />
                    </Avatar>
                    <div>
                      <Text fw={700} size="sm">{vehicle.licensePlate}</Text>
                      {(vehicle.brand || vehicle.model) && (
                        <Text size="xs" c="dimmed">
                          {[vehicle.brand, vehicle.model].filter(Boolean).join(" ")}
                        </Text>
                      )}
                    </div>
                  </Group>
                  <Group gap="xs">
                    {vehicle.year && (
                      <Badge variant="light" color="gray" size="sm">
                        {vehicle.year}
                      </Badge>
                    )}
                    {vehicle.vin && (
                      <Badge variant="light" color="blue" size="sm">
                        VIN: {vehicle.vin}
                      </Badge>
                    )}
                  </Group>
                </Group>
              </Card>
            </Anchor>
          ))}
        </Stack>
      )}
    </div>
  );
};

export default ClientVehicles;
