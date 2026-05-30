"use client";

import { Accordion, Badge, Divider, Group, Stack, Text } from "@mantine/core";
import { ReceiptResponseDTO } from "@/types/receipts";
import ReceiptsTable from "../receipts-table";
import ExportCSV from "../export-csv";
import { Dictionary } from "@/dictionaries";
import classes from "./receipts-by-month.module.css";

interface MonthGroup {
  key: string;
  label: string;
  receipts: ReceiptResponseDTO[];
  totalAmount: number;
}

const groupByMonth = (receipts: ReceiptResponseDTO[]): MonthGroup[] => {
  const map = new Map<string, MonthGroup>();

  for (const receipt of receipts) {
    const date = new Date(receipt.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;

    if (!map.has(key)) {
      const label = new Date(year, month, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      map.set(key, { key, label, receipts: [], totalAmount: 0 });
    }

    const group = map.get(key)!;
    group.receipts.push(receipt);
    group.totalAmount += receipt.total;
  }

  return Array.from(map.values()).sort((a, b) => b.key.localeCompare(a.key));
};

interface ReceiptsByMonthProps {
  receipts: ReceiptResponseDTO[];
  onUpdate?: (receipt: ReceiptResponseDTO) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

const ReceiptsByMonth = ({
  receipts,
  onUpdate,
  onDelete,
  readOnly = false,
}: ReceiptsByMonthProps) => {
  const groups = groupByMonth(receipts);

  return (
    <Accordion
      variant="separated"
      multiple
      defaultValue={groups.length > 0 ? [groups[0].key] : []}
      classNames={{ item: classes.item }}
    >
      {groups.map((group) => (
        <Accordion.Item key={group.key} value={group.key}>
          <Accordion.Control>
            <Group justify="space-between" pr="sm">
              <Text fw={700} size="lg">
                {group.label}
              </Text>
              <Group gap="xl">
                <Stack gap={2} align="center">
                  <Text size="xs" c="dimmed">
                    {Dictionary.receipts}
                  </Text>
                  <Badge variant="light" color="blue" size="md" radius="sm">
                    {group.receipts.length}
                  </Badge>
                </Stack>
                <Stack gap={2} align="flex-end">
                  <Text size="xs" c="dimmed">
                    {Dictionary.total}
                  </Text>
                  <Text fw={700} c="blue" size="sm">
                    {group.totalAmount.toFixed(2)} RON
                  </Text>
                </Stack>
              </Group>
            </Group>
          </Accordion.Control>
          <Accordion.Panel p="md" pt={0}>
            <Divider mb="md" />
            <Group justify="flex-end" mb="xs">
              <ExportCSV
                receipts={group.receipts}
                filename={`receipts-${group.key}.csv`}
                size="xs"
              />
            </Group>
            <ReceiptsTable
              receipts={group.receipts}
              onUpdate={onUpdate}
              onDelete={onDelete}
              readOnly={readOnly}
            />
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default ReceiptsByMonth;
