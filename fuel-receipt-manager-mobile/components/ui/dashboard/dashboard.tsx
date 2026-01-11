import { getAllReceipts } from "@/api/receipts";
import { ReceiptResponseDTO } from "@/types/receipts";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import FuelTypeChart from "./fuel-type-chart";
import HelloMessage from "./hello-message";
import ReceiptsChart from "./receipts-chart/receipts-chart";

const DashboardPage = () => {
  const [allReceipts, setAllReceipts] = useState<ReceiptResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllReceipts = async () => {
    try {
      const data = await getAllReceipts();
      setAllReceipts(data);
    } catch (error) {
      console.error("Failed to fetch receipts:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllReceipts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllReceipts();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <HelloMessage />

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007bff" />
          </View>
        ) : (
          <View style={styles.chartsContainer}>
            <View style={styles.chartWrapper}>
              <FuelTypeChart receipts={allReceipts} />
            </View>

            <View style={styles.chartWrapper}>
              <ReceiptsChart receipts={allReceipts} />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  loaderContainer: {
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  chartsContainer: {
    marginTop: 20,
    gap: 20,
    flexDirection: "column",
  },
  chartWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 20,
  },
});

export default DashboardPage;
