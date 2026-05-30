import {
  Button,
  Divider,
  FileInput,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Dictionary } from "@/dictionaries";
import { useForm } from "@mantine/form";
import { useState } from "react";
import {
  FuelType,
  OcrResponseDTO,
  PaymentMethod,
  ReceiptRequestDTO,
  ReceiptResponseDTO,
} from "@/types/receipts";
import dayjs from "dayjs";
import { createReceipt, updateReceipt } from "@/api/receipts";
import { createReceiptForClient, updateReceiptForClient } from "@/api/clients";
import classes from "./content.module.css";
import { notifications } from "@mantine/notifications";
import { IoScan } from "react-icons/io5";
import { scanReceipt } from "@/api/orc";
import useVehicles from "@/hooks/useVehicles";
import useClientVehicles from "@/hooks/useClientVehicles";
import useClients from "@/hooks/useClients";
import useUser from "@/hooks/useUser";

interface ContentProps {
  receipt?: ReceiptResponseDTO;
  onSuccess: () => void;
  onClose: () => void;
  defaultVehicleId?: string;
  defaultClientId?: string;
}

function parseOcrDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const match = dateStr.match(/(\d{2})[.,\-/]\s*(\d{2})[.,\-/]\s*(\d{4})/);
  if (match) {
    return new Date(
      parseInt(match[3]),
      parseInt(match[2]) - 1,
      parseInt(match[1]),
    );
  }
  return null;
}

function parseOcrTotal(totalStr: string | null): number {
  if (!totalStr) return 0;
  const parsed = parseFloat(totalStr.replace(",", ".").replace(/\s/g, ""));
  return isNaN(parsed) ? 0 : parsed;
}

function applyOcrResult(result: OcrResponseDTO) {
  return {
    cif: result.cif ?? "",
    date: parseOcrDate(result.date) ?? new Date(),
    receiptNumber: result.receiptNumber ?? "",
    fuelType:
      result.fuelType === "DIESEL" || result.fuelType === "GASOLINE"
        ? (result.fuelType as FuelType)
        : ("DIESEL" as FuelType),
    paymentMethod:
      result.paymentMethod === "CARD" || result.paymentMethod === "CASH"
        ? (result.paymentMethod as PaymentMethod)
        : ("CARD" as PaymentMethod),
    total: parseOcrTotal(result.total),
  };
}

const Content = ({ receipt, onSuccess, onClose, defaultVehicleId, defaultClientId }: ContentProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(defaultClientId ?? null);

  const { user } = useUser();
  const isAccountant = user?.role === "ACCOUNTANT";

  const { vehicles: ownVehicles } = useVehicles();
  const { clients } = useClients();
  const { vehicles: clientVehicles } = useClientVehicles(isAccountant ? selectedClientId : null);

  const vehicles = isAccountant ? clientVehicles : ownVehicles;

  const vehicleOptions = vehicles?.map((v) => ({
    value: v.id,
    label: v.brand && v.model
      ? `${v.licensePlate} — ${v.brand} ${v.model}`
      : v.licensePlate,
  })) ?? [];

  const clientOptions = clients?.map((c) => ({
    value: c.id,
    label: `${c.firstName} ${c.lastName} (${c.email})`,
  })) ?? [];

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      cif: receipt ? receipt.cif : "",
      date: receipt ? new Date(receipt.date) : new Date(),
      receiptNumber: receipt ? receipt.receiptNumber : "",
      fuelType: receipt ? receipt.fuelType : "DIESEL",
      paymentMethod: receipt ? receipt.paymentMethod : "CARD",
      total: receipt ? receipt.total : 0,
      vehicleId: receipt?.vehicleId ?? defaultVehicleId ?? "",
    },

    validate: {
      cif: (value) => (value.length === 0 ? Dictionary.cifRequired : null),
      receiptNumber: (value) =>
        value.length === 0 ? Dictionary.receiptNumberRequired : null,
      date: (value) => {
        if (!value) return Dictionary.dateRequired;
        if (value > new Date()) return Dictionary.dateCantBeInFuture;
        return null;
      },
      total: (value) => (value === 0 ? Dictionary.totalRequired : null),
      vehicleId: (value) => (value ? null : Dictionary.vehicleRequired),
    },
  });

  const handleScan = async () => {
    if (!scanFile) return;
    setIsScanning(true);
    try {
      const result = await scanReceipt(scanFile);
      form.setValues(applyOcrResult(result));
      notifications.show({
        title: Dictionary.scanComplete,
        message: Dictionary.scanCompleteDescription,
        color: "blue",
        autoClose: 4000,
        withBorder: true,
      });
    } catch (err: unknown) {
      notifications.show({
        title: Dictionary.scanFailed,
        message:
          err instanceof Error ? err.message : Dictionary.anErrorHadOccurred,
        color: "red",
        autoClose: 4000,
        withBorder: true,
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    setError(null);

    const payload: ReceiptRequestDTO = {
      ...values,
      date: dayjs(values.date).format("YYYY-MM-DDTHH:mm:ss"),
      vehicleId: values.vehicleId,
    };

    try {
      if (receipt) {
        if (isAccountant && selectedClientId) {
          await updateReceiptForClient(selectedClientId, receipt.id, payload);
        } else {
          await updateReceipt(receipt.id, payload);
        }
        notifications.show({
          title: Dictionary.success,
          message: Dictionary.theReceiptHasBeenUpdated,
          color: "green",
          autoClose: 4000,
          withBorder: true,
        });
      } else {
        if (isAccountant && selectedClientId) {
          await createReceiptForClient(selectedClientId, payload);
        } else {
          await createReceipt(payload);
        }
        notifications.show({
          title: Dictionary.success,
          message: Dictionary.theReceiptHasBeenAdded,
          color: "green",
          autoClose: 4000,
          withBorder: true,
        });
      }
      onSuccess();

      onClose();
      form.reset();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : Dictionary.anErrorHadOccurred,
      );
      notifications.show({
        title: Dictionary.error,
        message: Dictionary.anErrorHadOccurred,
        color: "red",
        autoClose: 3000,
        withBorder: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Stack gap="md">
        {!receipt && (
          <>
            <Text size="sm" c="dimmed">
              {Dictionary.scanReceiptDescription}
            </Text>
            <Group align="flex-end" gap="xs">
              <FileInput
                style={{ flex: 1 }}
                placeholder={Dictionary.uploadReceiptImage}
                accept="image/*"
                value={scanFile}
                onChange={setScanFile}
                disabled={isScanning || isLoading}
              />
              <Button
                variant="outline"
                leftSection={<IoScan size={16} />}
                loading={isScanning}
                disabled={!scanFile || isLoading}
                onClick={handleScan}
              >
                {Dictionary.scanReceipt}
              </Button>
            </Group>
            <Divider label={Dictionary.orFillManually} labelPosition="center" />
          </>
        )}

        {isAccountant && (
          <Select
            withAsterisk
            label={Dictionary.selectClient}
            placeholder={Dictionary.selectClient}
            data={clientOptions}
            searchable
            value={selectedClientId}
            onChange={(value) => {
              setSelectedClientId(value);
              form.setFieldValue("vehicleId", "");
            }}
            disabled={isLoading}
          />
        )}

        <Select
          withAsterisk
          label={Dictionary.selectVehicle}
          placeholder={Dictionary.selectVehicle}
          data={vehicleOptions}
          searchable
          key={form.key("vehicleId")}
          {...form.getInputProps("vehicleId")}
          disabled={isLoading || (isAccountant && !selectedClientId)}
        />

        <TextInput
          withAsterisk
          label={Dictionary.cif}
          placeholder={Dictionary.enterCif}
          key={form.key("cif")}
          {...form.getInputProps("cif")}
          disabled={isLoading}
        />

        <DatePickerInput
          withAsterisk
          label={Dictionary.date}
          placeholder={Dictionary.chooseDate}
          key={form.key("date")}
          {...form.getInputProps("date")}
          disabled={isLoading}
          valueFormat="DD.MM.YYYY"
          maxDate={new Date()}
        />

        <TextInput
          withAsterisk
          label={Dictionary.receiptNumber}
          placeholder={Dictionary.enterReceiptNumber}
          key={form.key("receiptNumber")}
          {...form.getInputProps("receiptNumber")}
          disabled={isLoading}
        />

        <Group grow>
          <Stack gap={4}>
            <Text size="sm" fw={500}>
              {Dictionary.fuelType}
            </Text>
            <SegmentedControl
              key={form.key("fuelType")}
              {...form.getInputProps("fuelType")}
              data={[
                { label: "Diesel", value: "DIESEL" },
                { label: "Gasoline", value: "GASOLINE" },
              ]}
              disabled={isLoading}
            />
          </Stack>

          <Stack gap={4}>
            <Text size="sm" fw={500}>
              {Dictionary.paymentMethod}
            </Text>
            <SegmentedControl
              key={form.key("paymentMethod")}
              {...form.getInputProps("paymentMethod")}
              data={[
                { label: "Card", value: "CARD" },
                { label: "Cash", value: "CASH" },
              ]}
              disabled={isLoading}
            />
          </Stack>
        </Group>

        <NumberInput
          withAsterisk
          label={Dictionary.total}
          placeholder="0.00"
          decimalScale={2}
          fixedDecimalScale
          suffix=" RON"
          key={form.key("total")}
          {...form.getInputProps("total")}
          disabled={isLoading}
        />

        {error && (
          <Text color="red" size="sm">
            {error}
          </Text>
        )}

        <Button type="submit" loading={isLoading} fullWidth mt="md">
          {receipt ? Dictionary.update : Dictionary.save}
        </Button>
      </Stack>
    </form>
  );
};

export default Content;
