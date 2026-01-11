import UserAvatar from "@/components/ui/user-avatar";
import { Dictionary } from "@/dictionaries";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#228be6",
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTitle: "",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerLeft: () => <UserAvatar />,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: Dictionary.dashboard,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="receipts"
        options={{
          tabBarLabel: Dictionary.receipts,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginLeft: 15,
  },
  logoBox: {
    backgroundColor: "#228be6",
    padding: 6,
    borderRadius: 8,
  },
});
