import { Button, StyleSheet, Text, View } from "react-native";

type UVCardProps = {
  uvIndex: number;
  loading: boolean;
  error: string;
  level: string;
  color: string; 
  onRefresh: () => void;
};

export default function UVCard({
  uvIndex,
  loading,
  error,
  level,
  color,
  onRefresh,

}: UVCardProps) {
  return (
    <View style={styles.card}>
        <Text style={styles.label}>UV Index</Text>

  {loading ? (
    <Text style={[styles.uv, { color }]}>Loading...</Text>
  ) : (
    <Text style={[styles.uv, { color }]}>{uvIndex}</Text>
  )}

  <Text style={[styles.level, { color }]}>
    {level}
  </Text>

  {error ? <Text style={styles.error}>{error}</Text> : null}

  <View style={styles.buttonContainer}>
    <Button
      title={loading ? "Refreshing..." : "Refresh"}
      onPress={onRefresh}
      disabled={loading}
    />
  </View>

     
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
  marginTop: 20,
  width: "60%",
  alignSelf: "center",
}
});