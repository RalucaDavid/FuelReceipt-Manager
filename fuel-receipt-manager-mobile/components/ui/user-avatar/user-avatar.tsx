import { getCurrentUser, logoutUser } from "@/api/auth";
import { Dictionary } from "@/dictionaries";
import { UserResponseDTO } from "@/types/auth";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Text } from "react-native-paper";

export const UserAvatar = () => {
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      await SecureStore.deleteItemAsync("auth-token");
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#228be6" />
      </View>
    );
  }

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

  return (
    <View style={styles.userSection}>
      <Avatar.Text
        size={36}
        label={initials}
        style={styles.avatar}
        labelStyle={styles.avatarLabel}
      />

      <View style={styles.box}>
        <Text variant="labelMedium" style={styles.userName}>
          {user?.firstName} {user?.lastName}
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text variant="bodySmall" style={styles.logoutText}>
            {Dictionary.logout}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 15,
    gap: 10,
  },
  loadingContainer: {
    marginRight: 20,
    justifyContent: "center",
  },
  avatar: {
    backgroundColor: "#6fb4f0",
  },
  avatarLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  box: {
    justifyContent: "center",
  },
  userName: {
    color: "#000",
    fontWeight: "600",
  },
  logoutText: {
    color: "#b9b9b9",
    fontWeight: "500",
  },
});
