import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const ReceiptsSkeleton = () => {
  const skeletonCards = Array(5)
    .fill(0)
    .map((_, index) => (
      <View key={index} style={styles.cardSkeleton}>
        <View style={styles.row}>
          <View style={styles.leftContent}>
            <View style={[styles.skeletonLine, { width: "60%", height: 16 }]} />
            <View
              style={[
                styles.skeletonLine,
                { width: "40%", height: 12, marginTop: 8 },
              ]}
            />
          </View>
          <View style={[styles.skeletonLine, { width: 60, height: 20 }]} />
        </View>

        <View
          style={[
            styles.row,
            {
              marginTop: 15,
              borderTopWidth: 1,
              borderTopColor: "#f0f0f0",
              paddingTop: 10,
            },
          ]}
        >
          <View style={[styles.skeletonLine, { width: 80, height: 12 }]} />
          <View style={[styles.skeletonLine, { width: 50, height: 12 }]} />
        </View>
      </View>
    ));

  return (
    <ScrollView style={styles.container} scrollEnabled={false}>
      {skeletonCards}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f8f9fa",
  },
  cardSkeleton: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    flex: 1,
  },
  skeletonLine: {
    backgroundColor: "#e9ecef",
    borderRadius: 4,
  },
});

export default ReceiptsSkeleton;
