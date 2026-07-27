import { Button, StyleSheet, Text, View } from "react-native";

type UVCardProps = {
  uvIndex: number;
  loading: boolean;
  error: string;
  level: string;
  onIncrease: () => void;
  onDecrease: () => void;
};

export default function UVCard({
  uvIndex,
  loading,
  error,
  level,
  onIncrease,
  onDecrease,
}: UVCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>UV Index</Text>

      {loading ? (
        <Text style={styles.uv}>...</Text>
      ) : (
        <Text style={styles.uv}>{uvIndex}</Text>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttonContainer}>
        <Button title="-" onPress={onDecrease} />
        <Button title="+" onPress={onIncrease} />
      </View>

      <Text style={styles.level}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 5,
  },

  label: {
    fontSize: 18,
    color: "#64748B",
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
    marginTop: 10,
  },

  error: {
    color: "red",
    marginVertical: 10,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginVertical: 20,
  },
});