import { Dictionary } from "@/dictionaries";
import { ReceiptResponseDTO } from "@/types/receipts";
import * as FileSystem from "expo-file-system"; // Importă tot obiectul
import * as Sharing from "expo-sharing";
import React from "react";
import { Button } from "react-native-paper";

interface ExportCSVProps {
  receipts: ReceiptResponseDTO[];
}

const ExportCSV = ({ receipts }: ExportCSVProps) => {
  const handleExport = async () => {
    // 1. Pregătirea datelor (String pur)
    const headers =
      "Data;CIF;Numar Bon;Tip Combustibil;Metoda Plata;Total (RON)\n";
    const rows = receipts
      .map((r) => {
        const date = new Date(r.date).toLocaleDateString("ro-RO");
        return `${date};${r.cif};${r.receiptNumber};${r.fuelType};${
          r.paymentMethod
        };${r.total.toFixed(2)}`;
      })
      .join("\n");

    const csvContent = headers + rows;
    const fileName = `export-${Date.now()}.csv`;

    // 2. Folosim FileSystem.cacheDirectory (proprietate a obiectului, nu export separat)
    const fileUri = FileSystem.cacheDirectory + fileName;

    try {
      // 3. Scriem fișierul folosind FileSystem.EncodingType
      await FileSystem.writeAsStringAsync(fileUri, "\ufeff" + csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // 4. Partajăm fișierul
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <Button
      mode="outlined"
      icon="share-variant"
      onPress={handleExport}
      disabled={receipts.length === 0}
    >
      {Dictionary.exportCSV}
    </Button>
  );
};

export default ExportCSV;
