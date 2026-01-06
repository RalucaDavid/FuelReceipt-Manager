import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Form from "./form";

const LoginPage = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.page}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formWrapper}>
          <Form />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formWrapper: {
    paddingHorizontal: 20,
    width: "100%",
  },
});

export default LoginPage;
