import { Dictionary } from "@/dictionaries";
import { ReceiptResponseDTO } from "@/types/receipts";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface Props {
  receipts: ReceiptResponseDTO[];
}

const screenWidth = Dimensions.get("window").width;

const monthKey = (d: string) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
};

const formatMobileLabel = (monthStr: string) => {
  const [year, month] = monthStr.split("-");
  return `${month}/${year.slice(2)}`;
};

export default function ReceiptsChart({ receipts }: Props) {
  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    receipts.forEach((r) => {
      const k = monthKey(r.date);
      map.set(k, (map.get(k) || 0) + r.total);
    });

    const aggregatedData = Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total: Number(total.toFixed(2)) }));

    const months = 6;
    const defaultData: { month: string; total: number }[] = [];
    for (let i = months - 1; i >= 0; i--) {
      const dt = new Date();
      dt.setMonth(dt.getMonth() - i);
      defaultData.push({ month: monthKey(dt.toISOString()), total: 0 });
    }

    const finalData = aggregatedData.length > 0 ? aggregatedData : defaultData;

    return {
      labels: finalData.map((d) => formatMobileLabel(d.month)),
      datasets: [
        {
          data: finalData.map((d) => d.total),
        },
      ],
    };
  }, [receipts]);

  const isEmpty = !receipts || receipts.length === 0;

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      {isEmpty && (
        <View style={styles.emptyContainer}>
          <Text style={styles.dimmedText}>{Dictionary.thereAreNoReceipts}</Text>
        </View>
      )}

      <BarChart
        data={chartData}
        width={screenWidth - 32}
        height={250}
        yAxisLabel=""
        yAxisSuffix=" RON"
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        fromZero={true}
        showValuesOnTopOfBars={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  emptyContainer: {
    paddingBottom: 10,
    alignItems: "center",
  },
  dimmedText: {
    color: "#868e96",
    fontSize: 14,
    marginBottom: 5,
  },
});
