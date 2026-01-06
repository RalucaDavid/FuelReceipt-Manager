import { Dictionary } from "@/dictionaries";
import { ReceiptResponseDTO } from "@/types/receipts";
import React from "react";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Content from "./content";

interface ReceiptModalProps {
  receipt?: ReceiptResponseDTO;
  onClose: () => void;
  opened: boolean;
  onSuccess: () => void;
}

const ReceiptModal = ({
  receipt,
  onClose,
  opened,
  onSuccess,
}: ReceiptModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={opened}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.modalTitle}>
            {receipt ? Dictionary.editReceipt : Dictionary.addNewReceipt}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentWrapper}>
          <Content receipt={receipt} onSuccess={onSuccess} onClose={onClose} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "bold",
  },
  contentWrapper: {
    flex: 1,
    padding: 20,
  },
});

export default ReceiptModal;
