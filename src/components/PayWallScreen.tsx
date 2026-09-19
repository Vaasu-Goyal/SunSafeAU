import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type PaywallScreenProps = {
  onClose: () => void;
  onSubscribe: () => void;
};

const BENEFITS = [
  "Personalized burn time based on your skin type",
  "Automatic sunscreen & water reminders",
  "Ad-free experience",
];

export default function PaywallScreen({ onClose, onSubscribe }: PaywallScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <View style={styles.hero}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={16} color="white" />
        </Pressable>

        <Text style={styles.crown}>👑</Text>
        <Text style={styles.headline}>Unlock SunSafeAU Premium</Text>
        <Text style={styles.subtext}>
          Personalized burn time, smart reminders & an ad-free experience
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          {BENEFITS.map((benefit) => (
            <View key={benefit} style={styles.benefitRow}>
              <Ionicons name="checkmark" size={16} color="#22C55E" />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, styles.pricingCard]}>
          <Text style={styles.price}>$10 AUD / year</Text>
          <Text style={styles.priceSub}>~$0.83/month — cancel anytime</Text>
        </View>

        <Pressable style={styles.ctaButton} onPress={onSubscribe}>
          <Text style={styles.ctaText}>Start Premium — $10/year</Text>
        </Pressable>

        <Pressable onPress={onClose}>
          <Text style={styles.maybeLater}>Maybe later</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff4d6" },
  scrollContent: { flexGrow: 1 },
  hero: {
    paddingTop: 64,
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 12,
    experimental_backgroundImage: "linear-gradient(160deg, #28293D, #4D3471)",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 24,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  crown: { fontSize: 48 },
  headline: { fontSize: 24, fontWeight: "700", color: "white", textAlign: "center" },
  subtext: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  content: { padding: 20, gap: 20 },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  benefitText: { flex: 1, fontSize: 14, fontWeight: "500", color: "#1E293B" },
  pricingCard: { alignItems: "center", gap: 6 },
  price: { fontSize: 26, fontWeight: "700", color: "#1E293B" },
  priceSub: { fontSize: 13, fontWeight: "500", color: "#64748B" },
  ctaButton: {
    backgroundColor: "#4D3471",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaText: { fontSize: 16, fontWeight: "700", color: "white" },
  maybeLater: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
  },
});