import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SkinTypeSelector from "@/components/SkinTypeSelector";
import { SkinType } from "@/types/skin";
import { getSkinType, setSkinType, resetExposure } from "@/utils/skin";
import { getIsPremium, setPremium } from "@/utils/premium";
import { requestNotificationPermission, sendTestNotification } from "@/utils/notification";

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Settings</Text>

        <SkinTypeSelector selected={skinType} onSelect={handleSelectSkinType} />

        <Pressable
          style={styles.premiumButton}
          onPress={async () => {
            await setPremium(!isPremium);
            setIsPremium(!isPremium);
          }}
        >
          <Text style={styles.premiumButtonText}>
            {isPremium ? "✓ Premium Active — Tap to Cancel (dev)" : "Simulate Purchase ($10 AUD)"}
          </Text>
        </Pressable>

        {__DEV__ && (
          <>
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
              style={[styles.devButton, { backgroundColor: "#EF4444" }]}
              onPress={resetExposure}
            >
              <Text style={styles.devButtonText}>Reset Burn Timer (dev)</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 20 },
  heading: { fontSize: 28, fontWeight: "700", color: "#1E293B", marginBottom: 16 },
  premiumButton: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  premiumButtonText: { color: "white", fontWeight: "600" },
  devButton: {
    backgroundColor: "#3B82F6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  devButtonText: { color: "white", fontWeight: "600" },
});