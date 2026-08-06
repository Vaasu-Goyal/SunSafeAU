import { View, Text, StyleSheet } from "react-native";

type UVChartEntry = {
  time: string;
  uv: number;
  temp: number;
  weatherCode: number;
};

type UVChartProps = {
  data: UVChartEntry[];
};

function formatHour(isoTime: string): string {
  const hour = parseInt(isoTime.split("T")[1].split(":")[0], 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}${period}`;
}

function getBarColor(uv: number): string {
  if (uv <= 2) return "#4CAF50";
  if (uv <= 5) return "#FBC02D";
  if (uv <= 7) return "#FB8C00";
  if (uv <= 10) return "#E53935";
  return "#8E24AA";
}

const MAX_BAR_HEIGHT = 100;
const MAX_UV_SCALE = 12; // roughly the highest UV value expected

export default function UVChart({ data }: UVChartProps) {
  if (data.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UV Trend</Text>
      <View style={styles.chartRow}>
        {data.map((entry, index) => {
          const barHeight = Math.max(
            4,
            (entry.uv / MAX_UV_SCALE) * MAX_BAR_HEIGHT
          );

          return (
            <View key={index} style={styles.barColumn}>
              <Text style={styles.uvLabel}>{entry.uv}</Text>
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: getBarColor(entry.uv),
                  },
                ]}
              />
              <Text style={styles.hourLabel}>{formatHour(entry.time)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 12,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: MAX_BAR_HEIGHT + 40,
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
  },
  uvLabel: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 4,
  },
  bar: {
    width: 14,
    borderRadius: 6,
  },
  hourLabel: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 6,
  },
});