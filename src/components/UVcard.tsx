import BurnTimeIndicator from "@/components/BurnTimeIndicator";
import { SkinType } from "@/types/skin";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FigmaColors, FigmaRadius } from "@/constants/theme";

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
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[FigmaColors.heroGradientStart, FigmaColors.heroGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <Text style={styles.uvLabel}>UV INDEX</Text>

        {loading ? (
          <Text style={styles.uvNumber}>…</Text>
        ) : (
          <Text style={styles.uvNumber}>{uvIndex}</Text>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.uvLevel}>{level}</Text>

        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Feather name="thermometer" size={14} color="white" />
            <Text style={styles.chipText}>{temperature}°C</Text>
          </View>
          <View style={styles.chip}>
            <Ionicons name={weatherIcon} size={14} color="white" />
            <Text style={styles.chipText}>{weather}</Text>
          </View>
        </View>
      </LinearGradient>

      {skinType && isPremium && (
        <BurnTimeIndicator skinType={skinType} uvIndex={uvIndex} />
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
  wrapper: {
    marginBottom: 20,
  },
  heroCard: {
    borderRadius: FigmaRadius.hero,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#E55926",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8, // Android fallback, since shadow* props render inconsistently there
  },
  uvLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  uvNumber: {
    color: "white",
    fontSize: 88,
    fontWeight: "700",
  },
  uvLevel: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  chipRow: {
    flexDirection: "row",
    gap: 24,
    marginTop: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: FigmaRadius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  error: {
    color: "#FFE4E1",
    marginTop: 4,
    fontSize: 13,
  },
  buttonContainer: {
    marginTop: 20,
    width: "60%",
    alignSelf: "center",
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
  burnTimeLockedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
    alignSelf: "center",
  },
  burnTimeLockedText: {
    fontSize: 13,
    color: "#94A3B8",
    fontStyle: "italic",
  },
});