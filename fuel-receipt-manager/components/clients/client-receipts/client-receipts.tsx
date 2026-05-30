"use client";

import { Dictionary } from "@/dictionaries";
import {
  Title,
  Text,
  Table,
  Badge,
  Group,
  Anchor,
  Skeleton,
  Stack,
  Avatar,
  Paper,
} from "@mantine/core";
import { FaRegCreditCard } from "react-icons/fa";
import { IoIosCash } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import useClientReceipts from "@/hooks/useClientReceipts";
import useClients from "@/hooks/useClients";
import classes from "./client-receipts.module.css";

interface ClientReceiptsProps {
  clientId: string;
}

const getInitials = (firstName: string, lastName: string) =>
  `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

const ClientReceipts = ({ clientId }: ClientReceiptsProps) => {
  const { receipts, isLoading } = useClientReceipts(clientId);
  const { clients } = useClients();

  const client = clients?.find((c) => c.id === clientId);

  const total = receipts?.reduce((sum, r) => sum + r.total, 0) ?? 0;

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
            <Text size="sm" c="dimmed">
              {client.email}
            </Text>
          )}
        </div>
      </Group>

      {!isLoading && receipts && receipts.length > 0 && (
        <Group mb="lg" gap="md">
          <Paper withBorder p="sm" radius="md" className={classes.statCard}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              {Dictionary.totalReceipts}
            </Text>
            <Text size="xl" fw={700}>
              {receipts.length}
            </Text>
          </Paper>
          <Paper withBorder p="sm" radius="md" className={classes.statCard}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              {Dictionary.totalSpent}
            </Text>
            <Text size="xl" fw={700} c="blue">
              {total.toFixed(2)} RON
            </Text>
          </Paper>
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
        <div className={classes.tableWrapper}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{Dictionary.cif}</Table.Th>
                <Table.Th>{Dictionary.date}</Table.Th>
                <Table.Th>{Dictionary.receiptNumber}</Table.Th>
                <Table.Th>{Dictionary.fuelType}</Table.Th>
                <Table.Th>{Dictionary.paymentMethod}</Table.Th>
                <Table.Th>{Dictionary.total}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {receipts.map((receipt) => (
                <Table.Tr key={receipt.id}>
                  <Table.Td>
                    <Text size="sm">{receipt.cif}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {new Date(receipt.date).toLocaleDateString("ro-RO")}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{receipt.receiptNumber}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={receipt.fuelType === "DIESEL" ? "gray" : "yellow"}
                      variant="light"
                    >
                      {receipt.fuelType}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {receipt.paymentMethod === "CARD" ? (
                        <FaRegCreditCard size={16} color="brown" />
                      ) : (
                        <IoIosCash size={16} color="green" />
                      )}
                      <Text size="sm">{receipt.paymentMethod}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={700} c="blue">
                      {receipt.total.toFixed(2)} RON
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ClientReceipts;
