import { getCurrentUser } from "@/api/auth";
import { Dictionary } from "@/dictionaries";
import { UserResponseDTO } from "@/types/auth";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const HelloMessage = () => {
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(5)).current;

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return Dictionary.goodMorning;
    if (hour < 18) return Dictionary.goodAfternoon;
    return Dictionary.goodEvening;
  };

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

  useEffect(() => {
    if (!isLoading && user) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonSubtitle} />
      </View>
    );
  }

  if (!user) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateY }],
        },
      ]}
    >
      <Text style={styles.greetingTitle}>
        {getGreeting()}, <Text style={styles.userName}>{user.firstName}</Text>
      </Text>

      <Text style={styles.dateText}>
        {Dictionary.todayIs} {getCurrentDate()}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    paddingHorizontal: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  loadingContainer: {
    gap: 10,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -1,
    color: "#000",
  },
  userName: {
    color: "#228be6",
  },
  dateText: {
    color: "#868e96",
    fontSize: 16,
    textTransform: "capitalize",
  },
  skeletonTitle: {
    height: 40,
    width: 300,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonSubtitle: {
    height: 20,
    width: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
});

export default HelloMessage;
