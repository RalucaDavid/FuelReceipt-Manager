import { Dictionary } from "@/dictionaries"; // Verifică calea
import { ReceiptResponseDTO } from "@/types/receipts"; // Verifică calea
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

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

const screenWidth = Dimensions.get("window").width;

export default function FuelTypeChart({ receipts }: Props) {
  const chartData = useMemo(() => {
    const map = new Map<string, number>();

    receipts.forEach((r) => {
      const key = (r.fuelType || "Unknown").toString();
      map.set(key, (map.get(key) || 0) + (Number(r.total) || 0));
    });

    return Array.from(map.entries()).map(([name, value], index) => ({
      name: name,
      population: Number(value.toFixed(2)),
      color: COLORS[index % COLORS.length],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    }));
  }, [receipts]);

  if (!receipts || receipts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.dimmedText}>{Dictionary.thereAreNoReceipts}</Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {Dictionary.fuelConsumption || "Fuel Types"}
      </Text>

      <PieChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 0]}
        absolute={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
  },
  centerContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  dimmedText: {
    color: "#868e96",
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
});
