import { StyleSheet, Text, View } from "react-native";
import { FigmaColors } from "@/constants/theme";

type HeaderProps = {
  location: string;
  lastUpdated: string;
};

export default function Header({ location, lastUpdated }: HeaderProps) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.updated}>Updated {lastUpdated}</Text>
      </View>
      <View style={styles.avatar} />
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
    backgroundColor: "white",
  },
});