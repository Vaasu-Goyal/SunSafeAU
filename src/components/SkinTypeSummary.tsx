import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { SKIN_TYPES, SkinType } from "@/types/skin";

type SkinTypeSummaryProps = {
  skinType: SkinType | null;
};

export default function SkinTypeSummary({ skinType }: SkinTypeSummaryProps) {
  const info = skinType ? SKIN_TYPES.find((s) => s.type === skinType) : null;

  return (
    <Pressable style={styles.row} onPress={() => router.push("/setting")}>
      {info ? (
        <>
          <View style={[styles.swatch, { backgroundColor: info.color }]} />
          <Text style={styles.text}>{info.label}</Text>
        </>
      ) : (
        <Text style={styles.text}>Set your skin type</Text>
      )}
      <Text style={styles.changeLink}>Change</Text>
      <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    gap: 8,
  },
  swatch: { width: 20, height: 20, borderRadius: 10 },
  text: { flex: 1, fontSize: 15, fontWeight: "600", color: "#334155" },
  changeLink: { fontSize: 13, color: "#3B82F6", fontWeight: "600" },
});
