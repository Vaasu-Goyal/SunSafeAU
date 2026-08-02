import { Button, StyleSheet, Text, View,Pressable } from "react-native";
import { Feather ,Ionicons} from "@expo/vector-icons"; 
  
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
        <View style={styles.labelRow}>
  <Ionicons name="sunny" size={20} color="#64748B" />
  <Text style={styles.label}>UV Index</Text>
</View>

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
  <Pressable
    style={({ pressed }) => [
      styles.refreshButton,
      pressed && styles.refreshButtonPressed,
      loading && styles.refreshButtonDisabled,
    ]}
    onPress={onRefresh}
    disabled={loading}
  >
    <Feather name="refresh-cw" size={18} color="#fff" />
    <Text style={styles.refreshText}>
      {loading ? "Refreshing..." : "Refresh"}
    </Text>
  </Pressable>
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
  },  
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  refreshButtonPressed: {
    opacity: 0.8,
  },

  refreshButtonDisabled: {
    backgroundColor: "#93C5FD",
  },

  refreshText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});