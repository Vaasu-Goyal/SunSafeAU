import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { SKIN_TYPES, SkinType } from "@/types/skin";
import { FigmaColors, FigmaRadius } from "@/constants/theme";
import BurnTimeIndicator from "@/components/BurnTimeIndicator";

type SunProtectionCardProps = {
  skinType: SkinType | null;
  onSelectSkinType: (type: SkinType) => void;
  isPremium: boolean;
  uvColor: string;
};

export default function SunProtectionCard({
  skinType,
  onSelectSkinType,
  isPremium,
  uvColor,
}: SunProtectionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your Sun Protection</Text>

      <Text style={styles.subheading}>Skin Type</Text>
      <View style={styles.chipRow}>
        {SKIN_TYPES.map((info) => {
          const isSelected = skinType === info.type;
          return (
            <Pressable
              key={info.type}
              onPress={() => onSelectSkinType(info.type)}
              style={[
                styles.chip,
                { backgroundColor: isSelected ? FigmaColors.chipActiveBg : FigmaColors.chipInactiveBg },
              ]}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {info.type}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.divider} />

      {skinType && isPremium && (
        <BurnTimeIndicator skinType={skinType} uvIndex={0} />
      )}

      {skinType && !isPremium && (
        <View style={styles.teaserContainer}>
          <View style={styles.teaserHeaderRow}>
            <Ionicons name="hourglass" size={18} color={FigmaColors.textMuted} />
            <View style={styles.blurredTextBlock}>
              <Text style={styles.blurredText}>•• •• ••</Text>
            </View>
          </View>

          <View style={styles.teaserBarTrack}>
            <View style={[styles.teaserBarFill, { backgroundColor: uvColor, width: "45%" }]} />
          </View>

          <Text style={styles.teaserCaption}>
            At today&apos;s UV, your Type {skinType} skin could be at risk sooner than you think.
          </Text>

          <Pressable style={styles.unlockButton} onPress={() => router.push("/paywall")}>
            <Ionicons name="lock-open" size={14} color="white" />
            <Text style={styles.unlockButtonText}>See My Personalized Timer</Text>
          </Pressable>
        </View>
      )}

      {!skinType && (
        <Text style={styles.lockedText}>Pick a skin type above to see burn time.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: FigmaRadius.card,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  title: { fontSize: 16, fontWeight: "600", color: FigmaColors.textSecondary, marginBottom: 12 },
  subheading: { fontSize: 13, fontWeight: "600", color: FigmaColors.textPrimary, marginBottom: 8 },
  chipRow: { flexDirection: "row", gap: 8 },
  chip: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  chipText: { fontSize: 13, fontWeight: "600", color: FigmaColors.textSecondary },
  chipTextSelected: { color: "white" },
  divider: { height: 1, backgroundColor: FigmaColors.divider, marginVertical: 16 },
  lockedText: { fontSize: 13, color: FigmaColors.textMuted, fontStyle: "italic", textAlign: "center" },
  teaserContainer: { alignItems: "center" },
  teaserHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  blurredTextBlock: { backgroundColor: FigmaColors.chipInactiveBg, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  blurredText: { fontSize: 20, fontWeight: "700", color: FigmaColors.textMuted, letterSpacing: 2 },
  teaserBarTrack: { width: "100%", height: 6, borderRadius: 3, backgroundColor: FigmaColors.divider, overflow: "hidden", marginBottom: 10 },
  teaserBarFill: { height: "100%", borderRadius: 3 },
  teaserCaption: { fontSize: 13, color: FigmaColors.textSecondary, textAlign: "center", marginBottom: 14 },
  unlockButton: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: FigmaColors.chipActiveBg, borderRadius: FigmaRadius.pill, paddingVertical: 10, paddingHorizontal: 18 },
  unlockButtonText: { color: "white", fontSize: 13, fontWeight: "600" },
});