import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLogged, setIsLogged] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("auth-token");
      setIsLogged(!!token);
    };
    checkToken();
  }, []);

  useEffect(() => {
    let canceled = false;
    const doRedirect = async () => {
      const token = await SecureStore.getItemAsync("auth-token");
      if (canceled) return;
      const loggedIn = !!token;
      const inAuthGroup = segments[0] === "(auth)";

      if (!loggedIn && !inAuthGroup) {
        router.replace("/(auth)/login");
      } else if (loggedIn && inAuthGroup) {
        router.replace("/(tabs)/dashboard");
      }
    };
    doRedirect();
    return () => {
      canceled = true;
    };
  }, [isLogged, router, segments]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(tabs)/dashboard" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal", headerShown: true }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
