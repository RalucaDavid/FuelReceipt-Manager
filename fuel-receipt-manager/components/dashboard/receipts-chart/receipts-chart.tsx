import { useMemo } from "react";
import { Center, Text } from "@mantine/core";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ReceiptResponseDTO } from "@/types/receipts";
import { Dictionary } from "@/dictionaries";

interface Props {
  receipts: ReceiptResponseDTO[];
}

const monthKey = (d: string) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
};

export default function ReceiptsChart({ receipts }: Props) {
  const data = useMemo(() => {
    const map = new Map<string, number>();
    receipts?.forEach((r) => {
      const k = monthKey(r.date);
      map.set(k, (map.get(k) || 0) + r.total);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total: Number(total.toFixed(2)) }));
  }, [receipts]);

  const defaultData = useMemo(() => {
    const months = 6;
    const arr: { month: string; total: number }[] = [];
    for (let i = months - 1; i >= 0; i--) {
      const dt = new Date();
      dt.setMonth(dt.getMonth() - i);
      arr.push({ month: monthKey(dt.toISOString()), total: 0 });
    }
    return arr;
  }, []);

  const chartData = data.length > 0 ? data : defaultData;
  const isEmpty = data.length === 0;

  return (
    <div style={{ width: "100%", height: 300 }}>
      {isEmpty && (
        <Center style={{ paddingBottom: 8 }}>
          <Text color="dimmed">{Dictionary.thereAreNoReceipts}</Text>
        </Center>
      )}
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis domain={[0, "dataMax"]} />
          <Tooltip formatter={(v: number) => `${Number(v).toFixed(2)} RON`} />
          <Bar dataKey="total" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
