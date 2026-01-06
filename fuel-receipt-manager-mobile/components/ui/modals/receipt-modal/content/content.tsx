import { createReceipt, updateReceipt } from "@/api/receipts";
import { Dictionary } from "@/dictionaries";
import { ReceiptRequestDTO, ReceiptResponseDTO } from "@/types/receipts";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  Button,
  HelperText,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";

interface ContentProps {
  receipt?: ReceiptResponseDTO;
  onSuccess: () => void;
  onClose: () => void;
}

const Content = ({ receipt, onSuccess, onClose }: ContentProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [values, setValues] = useState({
    cif: receipt ? receipt.cif : "",
    date: receipt ? new Date(receipt.date) : new Date(),
    receiptNumber: receipt ? receipt.receiptNumber : "",
    fuelType: receipt ? receipt.fuelType : "DIESEL",
    paymentMethod: receipt ? receipt.paymentMethod : "CARD",
    total: receipt ? receipt.total.toString() : "0",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!values.cif) errors.cif = Dictionary.cifRequired;
    if (!values.receiptNumber)
      errors.receiptNumber = Dictionary.receiptNumberRequired;
    if (!values.date) {
      errors.date = Dictionary.dateRequired;
    } else if (values.date > new Date()) {
      errors.date = Dictionary.dateCantBeInFuture;
    }
    if (Number(values.total) <= 0) errors.total = Dictionary.totalRequired;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const onSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setError(null);

    const payload: ReceiptRequestDTO = {
      ...values,
      total: Number(values.total),
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
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : Dictionary.anErrorHadOccurred
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label={Dictionary.cif}
        mode="outlined"
        value={values.cif}
        onChangeText={(v) => handleInputChange("cif", v)}
        error={!!formErrors.cif}
        disabled={isLoading}
      />
      <HelperText type="error" visible={!!formErrors.cif}>
        {formErrors.cif}
      </HelperText>

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        {Dictionary.date}: {dayjs(values.date).format("DD.MM.YYYY")}
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={values.date}
          maximumDate={new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) handleInputChange("date", date);
          }}
        />
      )}
      <HelperText type="error" visible={!!formErrors.date}>
        {formErrors.date}
      </HelperText>

      <TextInput
        label={Dictionary.receiptNumber}
        mode="outlined"
        value={values.receiptNumber}
        onChangeText={(v) => handleInputChange("receiptNumber", v)}
        error={!!formErrors.receiptNumber}
        disabled={isLoading}
      />
      <HelperText type="error" visible={!!formErrors.receiptNumber}>
        {formErrors.receiptNumber}
      </HelperText>

      <Text style={styles.label}>{Dictionary.fuelType}</Text>
      <SegmentedButtons
        value={values.fuelType}
        onValueChange={(v) => handleInputChange("fuelType", v)}
        buttons={[
          { value: "DIESEL", label: "Diesel" },
          { value: "GASOLINE", label: "Gasoline" },
        ]}
      />

      <Text style={[styles.label, { marginTop: 15 }]}>
        {Dictionary.paymentMethod}
      </Text>
      <SegmentedButtons
        value={values.paymentMethod}
        onValueChange={(v) => handleInputChange("paymentMethod", v)}
        buttons={[
          { value: "CARD", label: "Card" },
          { value: "CASH", label: "Cash" },
        ]}
      />

      <TextInput
        label={Dictionary.total}
        mode="outlined"
        keyboardType="numeric"
        value={values.total}
        onChangeText={(v) => handleInputChange("total", v)}
        error={!!formErrors.total}
        style={{ marginTop: 15 }}
        right={<TextInput.Affix text="RON" />}
      />
      <HelperText type="error" visible={!!formErrors.total}>
        {formErrors.total}
      </HelperText>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        mode="contained"
        onPress={onSubmit}
        loading={isLoading}
        style={styles.submitBtn}
      >
        {receipt ? Dictionary.update : Dictionary.save}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 30, paddingHorizontal: 4 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 8, color: "#666" },
  dateButton: { marginVertical: 5, borderRadius: 4 },
  submitBtn: { marginTop: 20, paddingVertical: 5, backgroundColor: "#228be6" },
  errorText: { color: "red", textAlign: "center", marginTop: 10 },
});

export default Content;
