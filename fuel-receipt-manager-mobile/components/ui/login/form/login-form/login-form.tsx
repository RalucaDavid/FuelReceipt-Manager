import { loginUser } from "@/api/auth";
import { Dictionary } from "@/dictionaries";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await loginUser({ email, password });
      const token: string = response.headers
        .get("set-cookie")
        .split("=")[1]
        .split(";")[0];
      await SecureStore.setItemAsync("auth-token", token);
      router.replace("/(tabs)/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || Dictionary.authenticationFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        style={styles.button}
      >
        {Dictionary.logIn}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", padding: 20 },
  input: { marginBottom: 12 },
  button: { marginTop: 10, paddingVertical: 5 },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
});
