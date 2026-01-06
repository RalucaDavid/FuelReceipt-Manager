import { Dictionary } from "@/dictionaries";
import { ReceiptResponseDTO } from "@/types/receipts";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";

interface ReceiptsListProps {
  receipts: ReceiptResponseDTO[];
  onUpdate: (receipt: ReceiptResponseDTO) => void;
  onDelete: (receiptId: string) => void;
}

const ReceiptsList = ({ receipts, onUpdate, onDelete }: ReceiptsListProps) => {
  const theme = useTheme();

  const confirmDelete = (id: string) => {
    Alert.alert("Ștergere Bon", "Ești sigur că vrei să ștergi acest bon?", [
      { text: "Anulează", style: "cancel" },
      { text: "Șterge", style: "destructive", onPress: () => onDelete(id) },
    ]);
  };

  const renderItem = ({ item }: { item: ReceiptResponseDTO }) => (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.row}>
          <View>
            <Text variant="labelSmall" style={styles.dimmedText}>
              {Dictionary.cif}
            </Text>
            <Text variant="titleMedium" style={styles.boldText}>
              {item.cif}
            </Text>
          </View>

          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => onUpdate(item)}
            />
            <IconButton
              icon="trash-can"
              iconColor={theme.colors.error}
              size={20}
              onPress={() => confirmDelete(item.id)}
            />
          </View>
        </View>

        <View style={[styles.row, styles.marginTop]}>
          <View style={styles.infoGroup}>
            <MaterialCommunityIcons name="calendar" size={14} color="gray" />
            <Text variant="bodySmall" style={styles.marginLeft}>
              {new Date(item.date).toLocaleDateString("ro-RO")}
            </Text>
          </View>
          <View style={styles.infoGroup}>
            <MaterialCommunityIcons
              name="ticket-outline"
              size={14}
              color="gray"
            />
            <Text variant="bodySmall" style={styles.marginLeft}>
              #{item.receiptNumber}
            </Text>
          </View>
        </View>

        <View style={[styles.row, styles.marginTop, styles.footer]}>
          <View style={styles.badges}>
            <View
              style={[
                styles.miniBadge,
                {
                  backgroundColor:
                    item.fuelType === "DIESEL" ? "#e9ecef" : "#fff3bf",
                },
              ]}
            >
              <Text style={styles.miniBadgeText}>{item.fuelType}</Text>
            </View>

            <View style={styles.infoGroup}>
              {item.paymentMethod === "CARD" ? (
                <FontAwesome5 name="credit-card" size={14} color="brown" />
              ) : (
                <Ionicons name="cash" size={14} color="green" />
              )}
              <Text variant="bodySmall" style={styles.marginLeft}>
                {item.paymentMethod}
              </Text>
            </View>
          </View>

          <Text variant="titleLarge" style={styles.totalText}>
            {item.total.toFixed(2)} RON
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      data={receipts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Nu există bonuri înregistrate.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 12,
    backgroundColor: "white",
    elevation: 2,
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  marginTop: {
    marginTop: 10,
  },
  actions: {
    flexDirection: "row",
  },
  infoGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  marginLeft: {
    marginLeft: 5,
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  miniBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  totalText: {
    fontWeight: "bold",
    color: "#228be6",
  },
  dimmedText: {
    color: "gray",
  },
  boldText: {
    fontWeight: "bold",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#f1f3f5",
    paddingTop: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "gray",
  },
});

export default ReceiptsList;
