import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FigmaColors, FigmaRadius } from "@/constants/theme";

type AdviceCardProps = {
  advice: string[];
  uvColor: string;
};

export default function AdviceCard({ advice, uvColor }: AdviceCardProps) {
  const [primary, ...secondary] = advice;

  return (
    <View style={[styles.card, { borderLeftColor: uvColor }]}>
      <Text style={styles.title}>Today&apos;s Advice</Text>

      {primary && (
        <View style={styles.primaryRow}>
          <View style={[styles.badge, { backgroundColor: uvColor }]}>
            <Ionicons name="checkmark" size={13} color="white" />
          </View>
          <Text style={styles.primaryText}>{primary}</Text>
        </View>
      )}

      {secondary.map((item) => (
        <View key={item} style={styles.tipRow}>
          <View style={[styles.badgeSmall, { backgroundColor: uvColor }]}>
            <Ionicons name="checkmark" size={11} color="white" />
          </View>
          <Text style={styles.tipText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: FigmaRadius.card,
    borderLeftWidth: 4,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: FigmaColors.textSecondary,
    marginBottom: 14,
  },
  primaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: FigmaColors.textPrimary,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  badgeSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: FigmaColors.textSecondary,
  },
});