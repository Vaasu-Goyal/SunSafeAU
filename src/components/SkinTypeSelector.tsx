import { SKIN_TYPES, SkinType } from "@/types/skin";
import { Pressable, StyleSheet, Text, View } from "react-native";

type SkinTypeSelectorProps = {
  selected: SkinType | null;
  onSelect: (type: SkinType) => void;
};

export default function SkinTypeSelector({
  selected,
  onSelect,
}: SkinTypeSelectorProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>What's your skin type?</Text>
      <Text style={styles.subtitle}>
        This helps us tailor sun safety advice to you.
      </Text>

      <View style={styles.optionsList}>
        {SKIN_TYPES.map((info) => {
          const isSelected = selected === info.type;

          return (
            <Pressable
              key={info.type}
              onPress={() => onSelect(info.type)}
              style={({ pressed }) => [
                styles.option,
                isSelected && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}
            >
              <View style={styles.optionRow}>
                <View
                  style={[styles.swatch, { backgroundColor: info.color }]}
                />
                <View style={styles.optionTextGroup}>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {info.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      isSelected && styles.optionDescriptionSelected,
                    ]}
                  >
                    {info.description}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
    marginBottom: 16,
  },
  optionsList: {
    gap: 10,
  },
  option: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#F1F5F9",
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionSelected: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
  },
  optionPressed: {
    opacity: 0.8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  optionTextGroup: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
  optionLabelSelected: {
    color: "#1D4ED8",
  },
  optionDescription: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  optionDescriptionSelected: {
    color: "#3B82F6",
  },
});
