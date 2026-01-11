import { deleteReceipt, getAllReceipts } from "@/api/receipts";
import { Dictionary } from "@/dictionaries";
import { ReceiptResponseDTO } from "@/types/receipts";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FAB, Title } from "react-native-paper";
import ReceiptModal from "../modals/receipt-modal";
import ReceiptsList from "./receipts-table";
import ReceiptsSkeleton from "./receipts-table-skeleton";

const ReceiptsPage = () => {
  const [allReceipts, setAllReceipts] = useState<ReceiptResponseDTO[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<
    ReceiptResponseDTO | undefined
  >(undefined);
  const [modalVisible, setModalVisible] = useState(false);
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllReceipts();
  };

  const handleDelete = async (receiptId: string) => {
    try {
      await deleteReceipt(receiptId);
      setAllReceipts((prev) => prev.filter((r) => r.id !== receiptId));
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleOpenEdit = (receipt: ReceiptResponseDTO) => {
    setSelectedReceipt(receipt);
    setModalVisible(true);
  };

  const handleOpenCreate = () => {
    setSelectedReceipt(undefined);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>{Dictionary.receipts}</Title>
        {/* <ExportCSV receipts={allReceipts} /> */}
      </View>

      {isLoading ? (
        <ReceiptsSkeleton />
      ) : (
        <View style={{ flex: 1 }}>
          <ReceiptsList
            receipts={allReceipts}
            onUpdate={handleOpenEdit}
            onDelete={handleDelete}
          />
        </View>
      )}

      <ReceiptModal
        receipt={selectedReceipt}
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={fetchAllReceipts}
      />

      <FAB
        icon="plus"
        color="white"
        style={styles.fab}
        onPress={handleOpenCreate}
        label={Dictionary.addNewReceipt}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#228be6",
    color: "white",
  },
});

export default ReceiptsPage;
