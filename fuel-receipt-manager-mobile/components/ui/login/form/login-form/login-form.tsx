import { loginUser } from "@/api/auth";
import { Dictionary } from "@/dictionaries";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!values.email) {
      newErrors.email = Dictionary.emailRequired;
    } else if (!/^\S+@\S+$/.test(values.email)) {
      newErrors.email = Dictionary.invalidEmail;
    }

    if (!values.password) {
      newErrors.password = Dictionary.passwordRequired;
    } else if (values.password.length < 8) {
      newErrors.password = Dictionary.passwordMinLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser({
        email: values.email,
        password: values.password,
      });
      const token: string = response.headers
        .get("set-cookie")
        .split("=")[1]
        .split(";")[0];
      await SecureStore.setItemAsync("auth-token", token);
      router.replace("/(tabs)/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || Dictionary.authenticationFailed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        label={Dictionary.emailAddress}
        mode="outlined"
        value={values.email}
        onChangeText={(val) => handleInputChange("email", val)}
        error={!!errors.email}
        disabled={isLoading}
        keyboardType="email-address"
        autoCapitalize="none"
        activeOutlineColor="#228be6"
      />
      <HelperText type="error" visible={!!errors.email}>
        {errors.email}
      </HelperText>

      <TextInput
        label={Dictionary.password}
        mode="outlined"
        secureTextEntry={!showPassword}
        value={values.password}
        onChangeText={(val) => handleInputChange("password", val)}
        error={!!errors.password}
        disabled={isLoading}
        activeOutlineColor="#228be6"
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isLoading}
        style={styles.button}
      >
        {Dictionary.logIn}
      </Button>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#228be6",
  },
  errorText: {
    color: "#fa5252",
    textAlign: "center",
    marginTop: 10,
    fontSize: 12,
  },
});
