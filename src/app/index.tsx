import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>☀️</Text>

      <Text style={styles.title}>SunSafe AU</Text>

      <Text style={styles.location}>Perth, WA</Text>

      <View style={styles.card}>
        <Text style={styles.label}>UV Index</Text>

        <Text style={styles.uv}>11</Text>

        <Text style={styles.level}>Very High</Text>
      </View>

      <View style={styles.adviceCard}>
        <Text style={styles.advice}>✓ Apply Sunscreen SPF 50+</Text>

        <Text style={styles.advice}>✓ Drink Water</Text>

        <Text style={styles.advice}>✓ Seek Shade</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffeb99",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  logo: {
    fontSize: 60,
    marginBottom: 10,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1E293B",
  },

  location: {
    fontSize: 18,
    color: "#64748B",
    marginBottom: 30,
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  label: {
    fontSize: 18,
    color: "#ffffff",
  },

  uv: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#E63946",
  },

  level: {
    fontSize: 24,
    fontWeight: "600",
    color: "#E63946",
  },

  adviceCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
  },

  advice: {
    fontSize: 18,
    marginVertical: 6,
    color: "#334155",
  },
});