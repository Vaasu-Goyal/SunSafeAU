import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import SkinTypeSelector from "@/components/SkinTypeSelector";
import { SkinType } from "@/types/skin";
import { getSkinType, setSkinType } from "@/utils/skin";
import { getIsPremium, setPremium } from "@/utils/premium";
import { requestNotificationPermission, sendTestNotification } from "@/utils/notification";
import { FigmaColors, FigmaRadius } from "@/constants/theme";

export default function SettingsScreen() {
  const [skinType, setSkinTypeState] = useState<SkinType | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    getSkinType().then(setSkinTypeState);
    getIsPremium().then(setIsPremium);
  }, []);

  async function handleSelectSkinType(type: SkinType) {
    await setSkinType(type);
    setSkinTypeState(type);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Settings</Text>

        <View style={[styles.statusCard, isPremium && styles.statusCardActive]}>
          {isPremium ? (
            <Ionicons name="sunny" size={22} color="white" />
          ) : (
            <MaterialCommunityIcons name="crown-outline" size={22} color="white" />
          )}
          <View style={styles.statusTextGroup}>
            <Text style={styles.statusTitle}>
              {isPremium ? "Premium Active" : "Free Plan"}
            </Text>
            <Text style={styles.statusSubtitle}>
              {isPremium
                ? "Personalized timer & reminders unlocked"
                : "Upgrade for personalized burn timing"}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <SkinTypeSelector selected={skinType} onSelect={handleSelectSkinType} />
        </View>

        {__DEV__ && (
          <View style={styles.devSection}>
            <Text style={styles.devLabel}>Developer Tools</Text>

            <Pressable
              style={styles.devButton}
              onPress={async () => {
                const granted = await requestNotificationPermission();
                if (granted) await sendTestNotification();
              }}
            >
              <Text style={styles.devButtonText}>Test Notification</Text>
            </Pressable>

            <Pressable
              style={[styles.devButton, { backgroundColor: FigmaColors.urgencyLow }]}
              onPress={async () => {
                await setPremium(true);
                setIsPremium(true);
              }}
            >
              <Text style={styles.devButtonText}>Simulate Purchase</Text>
            </Pressable>

            <Pressable
              style={[styles.devButton, { backgroundColor: "#EF4444" }]}
              onPress={async () => {
                await setPremium(false);
                setIsPremium(false);
              }}
            >
              <Text style={styles.devButtonText}>Reset Premium (dev only)</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFF4D6" },
  content: { padding: 20, paddingBottom: 40 },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: FigmaColors.textPrimary,
    marginBottom: 20,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: FigmaColors.premiumGradientEnd,
    borderRadius: FigmaRadius.card,
    padding: 16,
    marginBottom: 16,
  },
  statusCardActive: {
    backgroundColor: FigmaColors.heroGradientEnd,
  },
  statusTextGroup: { flex: 1 },
  statusTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
  },
  statusSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  card: {
    backgroundColor: "white",
    borderRadius: FigmaRadius.card,
    marginBottom: 16,
    overflow: "hidden",
  },
  devSection: {
    marginTop: 12,
    gap: 10,
  },
  devLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: FigmaColors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  devButton: {
    backgroundColor: FigmaColors.chipActiveBg,
    padding: 14,
    borderRadius: FigmaRadius.card,
    alignItems: "center",
  },
  devButtonText: { color: "white", fontWeight: "600" },
});