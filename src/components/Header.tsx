import { StyleSheet, Text } from "react-native";

export default function Header() {
  return (
    <>
      <Text style={styles.logo}>☀️</Text>

      <Text style={styles.title}>SunSafe AU</Text>

      <Text style={styles.location}>Perth, WA</Text>
    </>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E293B",
  },

  location: {
    fontSize: 18,
    textAlign: "center",
    color: "#64748B",
    marginBottom: 30,
  },
});