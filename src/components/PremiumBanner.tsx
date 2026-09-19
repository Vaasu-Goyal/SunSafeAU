import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { FigmaColors, FigmaRadius } from "@/constants/theme";

type PremiumBannerProps = {
  isPremium: boolean;
};

export default function PremiumBanner({ isPremium }: PremiumBannerProps) {
  if (isPremium) return null;

  return (
    <Pressable onPress={() => router.push("/paywall")}>
      <LinearGradient
        colors={[FigmaColors.premiumGradientStart, FigmaColors.premiumGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.banner}
      >
        <Text style={styles.crown}>👑</Text>
        <View style={styles.copy}>
          <Text style={styles.title}>Go Premium</Text>
          <Text style={styles.subtitle}>Auto sunscreen & water reminders</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: FigmaRadius.card,
    marginBottom: 20,
  },
  crown: { fontSize: 26 },
  copy: { flex: 1 },
  title: { color: "white", fontSize: 15, fontWeight: "600" },
  subtitle: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 },
});