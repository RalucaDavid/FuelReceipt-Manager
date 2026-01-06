import { Dictionary } from "@/dictionaries";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { SegmentedButtons, Text, Title } from "react-native-paper";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

const { width } = Dimensions.get("window");

const Form = () => {
  const [value, setValue] = useState("Sign In");

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Title style={styles.title}>
        {Dictionary.welcomeToFuelReceiptsManager}
      </Title>
      <Text style={styles.description}>{Dictionary.loginDescription}</Text>
      <View style={styles.tabsContainer}>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: "Sign In",
              label: Dictionary.logIn,
              style: styles.tabButton,
            },
            {
              value: "Register",
              label: Dictionary.register,
              style: styles.tabButton,
            },
          ]}
          style={styles.segmentedControl}
        />

        <View style={styles.panel}>
          {value === "Sign In" ? <LoginForm /> : <RegisterForm />}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  description: {
    textAlign: "center",
    color: "#6c757d",
    marginBottom: 30,
  },
  tabsContainer: {
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
  },
  segmentedControl: {
    marginBottom: 20,
    width: "100%",
  },
  tabButton: {},
  panel: {
    width: "100%",
  },
});

export default Form;
