import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ReceiptResponseDTO } from "@/types/receipts";

interface ReceiptsChartProps {
  receipts: ReceiptResponseDTO[];
}

const monthKey = (d: string) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
};

const ReceiptsChart = ({ receipts }: ReceiptsChartProps) => {
  const chartData = useMemo(() => {
    const totals = new Map<string, number>();
    receipts?.forEach((r) => {
      const k = monthKey(r.date);
      totals.set(k, (totals.get(k) || 0) + r.total);
    });

    const result: { month: string; total: number }[] = [];
    for (let i = 4; i >= 0; i--) {
      const dt = new Date();
      dt.setDate(1);
      dt.setMonth(dt.getMonth() - i);
      const key = monthKey(dt.toISOString());
      result.push({ month: key, total: Number((totals.get(key) || 0).toFixed(2)) });
    }
    return result;
  }, [receipts]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis domain={[0, "dataMax"]} />
          <Tooltip formatter={(v) => `${Number(v).toFixed(2)} RON`} />
          <Bar dataKey="total" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReceiptsChart;
