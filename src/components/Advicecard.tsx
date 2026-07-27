import { StyleSheet, Text, View } from "react-native";

type AdviceCardProps = {
  advice: string[];
};

export default function AdviceCard({ advice }: AdviceCardProps) {
  return (
    <View style={styles.card}>
      {advice.map((item) => (
        <Text key={item} style={styles.advice}>
          ✓ {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },

  advice: {
    fontSize: 18,
    color: "#334155",
    marginVertical: 6,
  },
});