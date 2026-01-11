"use client";

import { useEffect, useState } from "react";
import { ReceiptResponseDTO } from "@/types/receipts";
import { Button } from "@mantine/core";
import { IoMdDownload } from "react-icons/io";
import { CSVLink } from "react-csv";
import classes from "./export-csv.module.css";
import { Dictionary } from "@/dictionaries";

interface ExportCSVProps {
  receipts: ReceiptResponseDTO[];
}

const ExportCSV = ({ receipts }: ExportCSVProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const headers = [
    { label: "Date", key: "date" },
    { label: "CIF", key: "cif" },
    { label: "Receipt Number", key: "receiptNumber" },
    { label: "Fuel Type", key: "fuelType" },
    { label: "Payment Method", key: "paymentMethod" },
    { label: "Total (RON)", key: "total" },
  ];

  const csvData = receipts.map((r) => ({
    ...r,
    date: new Date(r.date).toLocaleDateString("ro-RO"),
    total: r.total.toFixed(2),
  }));

  if (!mounted) {
    return (
      <div style={{ textDecoration: "none" }}>
        <Button
          variant="outline"
          leftSection={<IoMdDownload size={16} />}
          disabled
        >
          {Dictionary.exportCSV}
        </Button>
      </div>
    );
  }

  return (
    <CSVLink
      data={csvData}
      headers={headers}
      filename={`receipts-export-${new Date().getTime()}.csv`}
      separator=";"
      style={{ textDecoration: "none" }}
    >
      <Button variant="outline" leftSection={<IoMdDownload size={16} />}>
        {Dictionary.exportCSV}
      </Button>
    </CSVLink>
  );
};

export default ExportCSV;
