"use client";

import { useState } from "react";
import { Dictionary } from "@/dictionaries";
import {
  Title,
  Text,
  Table,
  Avatar,
  Group,
  ActionIcon,
  Button,
  Skeleton,
  Badge,
  Tooltip,
  Modal,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { MdPersonRemove } from "react-icons/md";
import { IoReceiptSharp } from "react-icons/io5";
import Link from "next/link";
import useClients from "@/hooks/useClients";
import { removeClient } from "@/api/clients";
import { ClientResponseDTO } from "@/types/client";
import classes from "./clients.module.css";

const getInitials = (firstName: string, lastName: string) =>
  `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

const ClientsPage = () => {
  const { clients, isLoading, mutate } = useClients();
  const [removing, setRemoving] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientResponseDTO | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleOpenRemove = (client: ClientResponseDTO) => {
    setSelectedClient(client);
    open();
  };

  const handleClose = () => {
    setSelectedClient(null);
    close();
  };

  const handleConfirmRemove = async () => {
    if (!selectedClient) return;
    setRemoving(true);
    try {
      await removeClient(selectedClient.id);
      notifications.show({
        title: Dictionary.success,
        message: Dictionary.clientRemoved,
        color: "green",
      });
      mutate();
      handleClose();
    } catch (err: unknown) {
      notifications.show({
        title: Dictionary.error,
        message: err instanceof Error ? err.message : Dictionary.anErrorHadOccurred,
        color: "red",
      });
    } finally {
      setRemoving(false);
    }
  };

  const rows = clients?.map((client) => (
    <Table.Tr key={client.id} className={classes.row}>
      <Table.Td>
        <Group gap="sm">
          <Avatar color="blue" radius="xl" size="md">
            {getInitials(client.firstName, client.lastName)}
          </Avatar>
          <div>
            <Text size="sm" fw={600}>
              {client.firstName} {client.lastName}
            </Text>
            <Text size="xs" c="dimmed">
              {client.email}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color="blue" size="sm">
          {Dictionary.company}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <Button
            component={Link}
            href={`/clients/${client.id}`}
            size="xs"
            variant="light"
            leftSection={<IoReceiptSharp size={14} />}
          >
            {Dictionary.viewReceipts}
          </Button>
          <Tooltip label={Dictionary.removeClient} withArrow>
            <ActionIcon
              variant="light"
              color="red"
              size="md"
              onClick={() => handleOpenRemove(client)}
            >
              <MdPersonRemove size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className={classes.page}>
      <Group justify="space-between" align="center" mb="lg">
        <div>
          <Title order={2}>{Dictionary.myClients}</Title>
          {!isLoading && (
            <Text size="sm" c="dimmed" mt={2}>
              {clients?.length ?? 0}{" "}
              {clients?.length === 1 ? "client" : "clients"}
            </Text>
          )}
        </div>
      </Group>

      {isLoading && (
        <Stack gap="xs">
          <Skeleton height={56} radius="sm" />
          <Skeleton height={56} radius="sm" />
          <Skeleton height={56} radius="sm" />
        </Stack>
      )}

      {!isLoading && clients?.length === 0 && (
        <Text c="dimmed">{Dictionary.noClientsYet}</Text>
      )}

      {!isLoading && clients && clients.length > 0 && (
        <div className={classes.tableWrapper}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{Dictionary.firstName} / {Dictionary.lastName}</Table.Th>
                <Table.Th>{Dictionary.accountType}</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      )}

      <Modal
        opened={opened}
        onClose={handleClose}
        title={Dictionary.removeClient}
        centered
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">
            {Dictionary.confirmRemoveClient}{" "}
            <Text component="span" fw={600}>
              {selectedClient?.firstName} {selectedClient?.lastName}
            </Text>{" "}
            {Dictionary.confirmRemoveClientSuffix}
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={handleClose} disabled={removing}>
              {Dictionary.cancel}
            </Button>
            <Button color="red" onClick={handleConfirmRemove} loading={removing}>
              {Dictionary.confirm}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};

export default ClientsPage;
