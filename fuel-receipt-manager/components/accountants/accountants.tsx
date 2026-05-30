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
  Skeleton,
  Badge,
  Tooltip,
  Modal,
  Stack,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { MdPersonRemove, MdPersonAdd } from "react-icons/md";
import useAccountants from "@/hooks/useAccountants";
import { removeAccountant } from "@/api/clients";
import { ClientResponseDTO } from "@/types/client";
import classes from "./accountants.module.css";
import InviteAccountantModal from "@/components/modals/invite-accountant-modal";

const getInitials = (firstName: string, lastName: string) =>
  `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

const AccountantsPage = () => {
  const { accountants, isLoading, mutate } = useAccountants();
  const [removing, setRemoving] = useState(false);
  const [selected, setSelected] = useState<ClientResponseDTO | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [inviteOpened, { open: openInvite, close: closeInvite }] = useDisclosure(false);

  const handleOpenRemove = (accountant: ClientResponseDTO) => {
    setSelected(accountant);
    open();
  };

  const handleClose = () => {
    setSelected(null);
    close();
  };

  const handleConfirmRemove = async () => {
    if (!selected) return;
    setRemoving(true);
    try {
      await removeAccountant(selected.id);
      notifications.show({
        title: Dictionary.success,
        message: Dictionary.accountantRemoved,
        color: "green",
      });
      mutate();
      handleClose();
    } catch (err: unknown) {
      notifications.show({
        title: Dictionary.error,
        message:
          err instanceof Error ? err.message : Dictionary.anErrorHadOccurred,
        color: "red",
      });
    } finally {
      setRemoving(false);
    }
  };

  const rows = accountants?.map((accountant) => (
    <Table.Tr key={accountant.id} className={classes.row}>
      <Table.Td>
        <Group gap="sm">
          <Avatar color="teal" radius="xl" size="md">
            {getInitials(accountant.firstName, accountant.lastName)}
          </Avatar>
          <div>
            <Text size="sm" fw={600}>
              {accountant.firstName} {accountant.lastName}
            </Text>
            <Text size="xs" c="dimmed">
              {accountant.email}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color="teal" size="sm">
          {Dictionary.accountant}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group justify="flex-end">
          <Tooltip label={Dictionary.removeAccountant} withArrow>
            <ActionIcon
              variant="light"
              color="red"
              size="md"
              onClick={() => handleOpenRemove(accountant)}
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
          <Title order={2}>{Dictionary.myAccountants}</Title>
          {!isLoading && (
            <Text size="sm" c="dimmed" mt={2}>
              {accountants?.length ?? 0}{" "}
              {accountants?.length === 1 ? "accountant" : "accountants"}
            </Text>
          )}
        </div>
        <Button leftSection={<MdPersonAdd size={16} />} onClick={openInvite}>
          {Dictionary.inviteAccountant}
        </Button>
      </Group>

      {isLoading && (
        <Stack gap="xs">
          <Skeleton height={56} radius="sm" />
          <Skeleton height={56} radius="sm" />
          <Skeleton height={56} radius="sm" />
        </Stack>
      )}

      {!isLoading && accountants?.length === 0 && (
        <Text c="dimmed">{Dictionary.noAccountantsYet}</Text>
      )}

      {!isLoading && accountants && accountants.length > 0 && (
        <div className={classes.tableWrapper}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  {Dictionary.firstName} / {Dictionary.lastName}
                </Table.Th>
                <Table.Th>{Dictionary.accountType}</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      )}

      <InviteAccountantModal opened={inviteOpened} onClose={closeInvite} />

      <Modal
        opened={opened}
        onClose={handleClose}
        title={Dictionary.removeAccountant}
        centered
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">
            {Dictionary.confirmRemoveClient}{" "}
            <Text component="span" fw={600}>
              {selected?.firstName} {selected?.lastName}
            </Text>{" "}
            {Dictionary.confirmRemoveAccountantSuffix}
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={handleClose} disabled={removing}>
              {Dictionary.cancel}
            </Button>
            <Button
              color="red"
              onClick={handleConfirmRemove}
              loading={removing}
            >
              {Dictionary.confirm}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};

export default AccountantsPage;
