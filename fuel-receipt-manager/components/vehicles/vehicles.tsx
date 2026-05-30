"use client";

import { useState } from "react";
import {
  Title, Text, Table, Group, ActionIcon, Button,
  Skeleton, Stack, Tooltip, Modal, TextInput, NumberInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { MdEdit } from "react-icons/md";
import { FaTrash, FaCar } from "react-icons/fa";
import { Dictionary } from "@/dictionaries";
import useVehicles from "@/hooks/useVehicles";
import { createVehicle, updateVehicle, deleteVehicle } from "@/api/vehicles";
import { VehicleResponseDTO } from "@/types/vehicle";
import classes from "./vehicles.module.css";

const emptyForm = {
  licensePlate: "",
  brand: "",
  model: "",
  year: null as number | null,
  vin: "",
};

const VehiclesPage = () => {
  const { vehicles, isLoading, mutate } = useVehicles();
  const [editing, setEditing] = useState<VehicleResponseDTO | null>(null);
  const [deleting, setDeleting] = useState<VehicleResponseDTO | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: emptyForm,
    validate: {
      licensePlate: (v) => (v ? null : Dictionary.licensePlateRequired),
    },
  });

  const handleOpenAdd = () => {
    setEditing(null);
    form.setValues(emptyForm);
    openForm();
  };

  const handleOpenEdit = (vehicle: VehicleResponseDTO) => {
    setEditing(vehicle);
    form.setValues({
      licensePlate: vehicle.licensePlate,
      brand: vehicle.brand ?? "",
      model: vehicle.model ?? "",
      year: vehicle.year ?? null,
      vin: vehicle.vin ?? "",
    });
    openForm();
  };

  const handleOpenDelete = (vehicle: VehicleResponseDTO) => {
    setDeleting(vehicle);
    openDelete();
  };

  const handleCloseForm = () => {
    setEditing(null);
    form.reset();
    closeForm();
  };

  const handleSubmit = async (values: typeof form.values) => {
    setIsSaving(true);
    try {
      if (editing) {
        await updateVehicle(editing.id, values);
        notifications.show({ title: Dictionary.success, message: Dictionary.vehicleUpdated, color: "green" });
      } else {
        await createVehicle(values);
        notifications.show({ title: Dictionary.success, message: Dictionary.vehicleAdded, color: "green" });
      }
      mutate();
      handleCloseForm();
    } catch (err: unknown) {
      notifications.show({
        title: Dictionary.error,
        message: err instanceof Error ? err.message : Dictionary.anErrorHadOccurred,
        color: "red",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await deleteVehicle(deleting.id);
      notifications.show({ title: Dictionary.success, message: Dictionary.vehicleDeleted, color: "green" });
      mutate();
      closeDelete();
      setDeleting(null);
    } catch (err: unknown) {
      notifications.show({
        title: Dictionary.error,
        message: err instanceof Error ? err.message : Dictionary.anErrorHadOccurred,
        color: "red",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const rows = vehicles?.map((v) => (
    <Table.Tr key={v.id}>
      <Table.Td>
        <Group gap="xs">
          <FaCar size={14} color="var(--mantine-color-blue-6)" />
          <Text size="sm" fw={600}>{v.licensePlate}</Text>
        </Group>
      </Table.Td>
      <Table.Td><Text size="sm">{v.brand ?? "—"}</Text></Table.Td>
      <Table.Td><Text size="sm">{v.model ?? "—"}</Text></Table.Td>
      <Table.Td><Text size="sm">{v.year ?? "—"}</Text></Table.Td>
      <Table.Td><Text size="sm" c="dimmed">{v.vin ?? "—"}</Text></Table.Td>
      <Table.Td>
        <Group gap={4} justify="flex-end">
          <Tooltip label={Dictionary.editVehicle} withArrow>
            <ActionIcon variant="light" color="gray" size="md" onClick={() => handleOpenEdit(v)}>
              <MdEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={Dictionary.deleteVehicle} withArrow>
            <ActionIcon variant="light" color="red" size="md" onClick={() => handleOpenDelete(v)}>
              <FaTrash size={14} />
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
          <Title order={2}>{Dictionary.myVehicles}</Title>
          {!isLoading && (
            <Text size="sm" c="dimmed" mt={2}>
              {vehicles?.length ?? 0} {vehicles?.length === 1 ? "vehicle" : "vehicles"}
            </Text>
          )}
        </div>
        <Button leftSection={<FaCar size={14} />} onClick={handleOpenAdd}>
          {Dictionary.addVehicle}
        </Button>
      </Group>

      {isLoading && (
        <Stack gap="xs">
          <Skeleton height={48} radius="sm" />
          <Skeleton height={48} radius="sm" />
          <Skeleton height={48} radius="sm" />
        </Stack>
      )}

      {!isLoading && vehicles?.length === 0 && (
        <Text c="dimmed">{Dictionary.noVehiclesYet}</Text>
      )}

      {!isLoading && vehicles && vehicles.length > 0 && (
        <div className={classes.tableWrapper}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{Dictionary.licensePlate}</Table.Th>
                <Table.Th>{Dictionary.brand}</Table.Th>
                <Table.Th>{Dictionary.model}</Table.Th>
                <Table.Th>{Dictionary.yearOfManufacture}</Table.Th>
                <Table.Th>VIN</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      )}

      {/* Add / Edit modal */}
      <Modal
        opened={formOpened}
        onClose={handleCloseForm}
        title={editing ? Dictionary.editVehicle : Dictionary.addVehicle}
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              withAsterisk
              label={Dictionary.licensePlate}
              placeholder={Dictionary.enterLicensePlate}
              key={form.key("licensePlate")}
              {...form.getInputProps("licensePlate")}
              disabled={isSaving}
            />
            <Group grow>
              <TextInput
                label={Dictionary.brand}
                placeholder={Dictionary.enterBrand}
                key={form.key("brand")}
                {...form.getInputProps("brand")}
                disabled={isSaving}
              />
              <TextInput
                label={Dictionary.model}
                placeholder={Dictionary.enterModel}
                key={form.key("model")}
                {...form.getInputProps("model")}
                disabled={isSaving}
              />
            </Group>
            <Group grow>
              <NumberInput
                label={Dictionary.yearOfManufacture}
                placeholder={Dictionary.enterYear}
                min={1900}
                max={new Date().getFullYear()}
                key={form.key("year")}
                {...form.getInputProps("year")}
                disabled={isSaving}
              />
              <TextInput
                label={Dictionary.vin}
                placeholder={Dictionary.enterVin}
                key={form.key("vin")}
                {...form.getInputProps("vin")}
                disabled={isSaving}
              />
            </Group>
            <Button type="submit" loading={isSaving} fullWidth>
              {editing ? Dictionary.update : Dictionary.save}
            </Button>
          </Stack>
        </form>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        opened={deleteOpened}
        onClose={() => { closeDelete(); setDeleting(null); }}
        title={Dictionary.deleteVehicle}
        centered
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">
            {Dictionary.confirmDeleteVehicle}{" "}
            <Text component="span" fw={600}>{deleting?.licensePlate}</Text>?
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => { closeDelete(); setDeleting(null); }} disabled={isDeleting}>
              {Dictionary.cancel}
            </Button>
            <Button color="red" onClick={handleConfirmDelete} loading={isDeleting}>
              {Dictionary.confirm}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};

export default VehiclesPage;
