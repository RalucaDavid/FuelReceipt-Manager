"use client";

import { useMemo } from "react";
import { Center, Text } from "@mantine/core";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { ReceiptResponseDTO } from "@/types/receipts";
import { Dictionary } from "@/dictionaries";

interface Props {
  receipts: ReceiptResponseDTO[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export default function FuelTypeChart({ receipts }: Props) {
  const data = useMemo(() => {
    const map = new Map<string, number>();
    receipts.forEach((r) => {
      const key = (r.fuelType || "Unknown").toString();
      map.set(key, (map.get(key) || 0) + (Number(r.total) || 0));
    });
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }));
  }, [receipts]);

  if (!receipts || receipts.length === 0) {
    return (
      <Center style={{ height: 300 }}>
        <Text color="dimmed">{Dictionary.thereAreNoReceipts}</Text>
      </Center>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            label
          >
            {data.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `${Number(v).toFixed(2)} RON`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
