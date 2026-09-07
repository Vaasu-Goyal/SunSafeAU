import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

import { formatBurnTime } from "@/utils/skin";
import { useBurnExposure } from "@/hooks/useBurnExposure";
import { SkinType } from "@/types/skin";

type BurnTimeIndicatorProps = {
  skinType: SkinType | null;
  uvIndex: number;
};

function getUrgency(remainingFraction: number, minutesToBurn: number | null) {
  if (minutesToBurn === null)
    return { level: "none" as const, color: "#64748B", label: "No burn risk right now" };
  if (remainingFraction <= 0)
    return { level: "urgent" as const, color: "#EF4444", label: "Reapply now" };
  if (remainingFraction < 0.33)
    return { level: "urgent" as const, color: "#EF4444", label: "Urgent" };
  if (remainingFraction < 0.66)
    return { level: "moderate" as const, color: "#FB8C00", label: "Moderate" };
  return { level: "safe" as const, color: "#22C55E", label: "Low urgency" };
}

export default function BurnTimeIndicator({ skinType, uvIndex }: BurnTimeIndicatorProps) {
  const { exposureFraction, minutesToBurn } = useBurnExposure(skinType, uvIndex);
  const remainingFraction = Math.max(0, 1 - exposureFraction);
  const urgency = getUrgency(remainingFraction, minutesToBurn);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (urgency.level === "urgent") {
      pulse.value = withRepeat(
        withTiming(1.15, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    } else {
      pulse.value = withTiming(1, { duration: 200 });
    }
  }, [urgency.level, pulse]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Animated.View style={animatedIconStyle}>
          <Ionicons name="hourglass" size={20} color={urgency.color} />
        </Animated.View>
        <Text style={[styles.badgeLabel, { color: urgency.color }]}>{urgency.label}</Text>
      </View>

      <Text style={styles.timeText}>{formatBurnTime(minutesToBurn)}</Text>

      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: `${remainingFraction * 100}%`, backgroundColor: urgency.color },
          ]}
        />
      </View>

      <Text style={styles.caption}>
        Estimated time in direct sun before burn risk, based on your skin type and current UV.
        Reapply sunscreen before this window closes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 14, width: "100%", alignItems: "center" },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  badgeLabel: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timeText: { fontSize: 20, fontWeight: "700", color: "#1E293B", marginTop: 4 },
  barTrack: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    marginTop: 10,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 3 },
  caption: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 8,
  },
});
