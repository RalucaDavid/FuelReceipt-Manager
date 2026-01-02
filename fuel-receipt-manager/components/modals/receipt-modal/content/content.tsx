import {
  Group,
  SegmentedControl,
  Stack,
  TextInput,
  Text,
  NumberInput,
  Button,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Dictionary } from "@/dictionaries";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { ReceiptRequestDTO, ReceiptResponseDTO } from "@/types/receipts";
import dayjs from "dayjs";
import { createReceipt, updateReceipt } from "@/api/receipts";
import classes from "./content.module.css";

interface ContentProps {
  receipt?: ReceiptResponseDTO;
  onSuccess: () => void;
  onClose: () => void;
}

const Content = ({ receipt, onSuccess, onClose }: ContentProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      cif: receipt ? receipt.cif : "",
      date: receipt ? new Date(receipt.date) : new Date(),
      receiptNumber: receipt ? receipt.receiptNumber : "",
      fuelType: receipt ? receipt.fuelType : "DIESEL",
      paymentMethod: receipt ? receipt.paymentMethod : "CARD",
      total: receipt ? receipt.total : 0,
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
    },
  });

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    setError(null);

    const payload: ReceiptRequestDTO = {
      ...values,
      date: dayjs(values.date).format("YYYY-MM-DDTHH:mm:ss"),
    };

    try {
      if (receipt) {
        await updateReceipt(receipt.id, payload);
      } else {
        await createReceipt(payload);
      }
      onSuccess();
      onClose();
      form.reset();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : Dictionary.anErrorHadOccurred
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Stack gap="md">
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
