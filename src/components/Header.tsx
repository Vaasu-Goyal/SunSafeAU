import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { FigmaColors } from "@/constants/theme";

type HeaderProps = {
  location: string;
  lastUpdated: string;
  isPremium: boolean;
};

export default function Header({ location, lastUpdated, isPremium }: HeaderProps) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.updated}>Updated {lastUpdated}</Text>
      </View>

      <Pressable
        style={[styles.avatar, isPremium ? styles.avatarPremium : styles.avatarFree]}
        onPress={() => router.push(isPremium ? "/settings" : "/paywall")}
      >
        {isPremium ? (
          <Ionicons name="sunny" size={18} color="white" />
        ) : (
          <MaterialCommunityIcons name="crown-outline" size={18} color="white" />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  location: {
    fontSize: 20,
    fontWeight: "700",
    color: FigmaColors.textPrimary,
  },
  updated: {
    fontSize: 12,
    fontWeight: "500",
    color: FigmaColors.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarFree: {
    backgroundColor: FigmaColors.premiumGradientEnd,
  },
  avatarPremium: {
    backgroundColor: FigmaColors.heroGradientEnd,
  },
});