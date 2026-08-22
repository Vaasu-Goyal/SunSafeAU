import { SkinType } from "@/types/skin";
import { formatBurnTime, getMinutesToBurn } from "@/utils/skin";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type UVCardProps = {
  uvIndex: number;
  loading: boolean;
  error: string;
  level: string;
  color: string;
  onRefresh: () => void;
  temperature: number;
  weather: string;
  weatherIcon: keyof typeof Ionicons.glyphMap;
  skinType: SkinType | null;
  isPremium: boolean;
};

export default function UVCard({
  uvIndex,
  loading,
  error,
  level,
  color,
  onRefresh,
  temperature,
  weather,
  weatherIcon,
  skinType,
  isPremium,
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

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={[styles.levelBadge, { backgroundColor: color }]}>
        <Text style={styles.levelBadgeText}>{level}</Text>
      </View>

      <View style={styles.tempRow}>
        <Feather name="thermometer" size={16} color="#64748B" />
        <Text style={styles.tempText}>{temperature}°C</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.weatherRow}>
        <Ionicons name={weatherIcon} size={20} color="#64748B" />
        <Text style={styles.weather}>{weather}</Text>
      </View>

      {skinType && isPremium && (
        <View style={styles.burnTimeRow}>
          <Ionicons name="body" size={18} color="#64748B" />
          <Text style={styles.burnTimeText}>
            Burn time: {formatBurnTime(getMinutesToBurn(skinType, uvIndex))}
          </Text>
        </View>
      )}

      {skinType && !isPremium && (
        <View style={styles.burnTimeLockedRow}>
          <Ionicons name="lock-closed" size={16} color="#94A3B8" />
          <Text style={styles.burnTimeLockedText}>
            Unlock your personalized burn time with Premium
          </Text>
        </View>
      )}

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
    elevation: 5, // keep this for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
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
  tempRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },

  tempText: {
    fontSize: 16,
    color: "#64748B",
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },

  weather: {
    fontSize: 18,
    color: "#475569",
  },

  levelBadge: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },

  levelBadgeText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },

  burnTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },
  burnTimeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
  burnTimeLockedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },
  burnTimeLockedText: {
    fontSize: 13,
    color: "#94A3B8",
    fontStyle: "italic",
  },
});
