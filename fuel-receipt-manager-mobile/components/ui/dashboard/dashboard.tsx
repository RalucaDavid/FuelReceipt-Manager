import { Dictionary } from "@/dictionaries";
import { StyleSheet, Text, View } from "react-native";

const DashboardPage = () => {
  return (
    <View>
      <Text>{Dictionary.dashboard}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default DashboardPage;
