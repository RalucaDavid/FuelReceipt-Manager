"use client";

import { useState } from "react";
import { Modal, TextInput, Button, Text, Stack, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dictionary } from "@/dictionaries";
import { inviteAccountant } from "@/api/clients";
import { notifications } from "@mantine/notifications";

interface InviteAccountantModalProps {
  opened: boolean;
  onClose: () => void;
}

const InviteAccountantModal = ({
  opened,
  onClose,
}: InviteAccountantModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { accountantEmail: "" },
    validate: {
      accountantEmail: (value) => {
        if (!value) return Dictionary.emailRequired;
        return /^\S+@\S+$/.test(value) ? null : Dictionary.invalidEmail;
      },
    },
  });

  const handleClose = () => {
    form.reset();
    setPendingEmail(null);
    onClose();
  };

  const handleConfirm = async () => {
    if (!pendingEmail) return;
    setIsLoading(true);
    try {
      await inviteAccountant(pendingEmail);
      notifications.show({
        title: Dictionary.success,
        message: Dictionary.inviteSent,
        color: "green",
      });
      handleClose();
    } catch (err: unknown) {
      notifications.show({
        title: Dictionary.error,
        message: err instanceof Error ? err.message : Dictionary.anErrorHadOccurred,
        color: "red",
      });
      setPendingEmail(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={Dictionary.inviteAccountant}
      centered
    >
      {pendingEmail === null ? (
        <form onSubmit={form.onSubmit(({ accountantEmail }) => setPendingEmail(accountantEmail))}>
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              {Dictionary.inviteAccountantDescription}
            </Text>
            <TextInput
              withAsterisk
              label={Dictionary.accountantEmail}
              placeholder={Dictionary.enterAccountantEmail}
              key={form.key("accountantEmail")}
              {...form.getInputProps("accountantEmail")}
            />
            <Button type="submit">
              {Dictionary.invite}
            </Button>
          </Stack>
        </form>
      ) : (
        <Stack gap="md">
          <Text size="sm">
            {Dictionary.confirmInviteAccountant}{" "}
            <Text component="span" fw={600}>
              {pendingEmail}
            </Text>
            ?
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setPendingEmail(null)} disabled={isLoading}>
              {Dictionary.cancel}
            </Button>
            <Button onClick={handleConfirm} loading={isLoading}>
              {Dictionary.confirm}
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
};

export default InviteAccountantModal;
