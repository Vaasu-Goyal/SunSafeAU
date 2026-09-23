import { ScrollView, View, Text, StyleSheet } from "react-native";
import { HourlyForecastEntry } from "@/types/weather";
import { FigmaColors, FigmaRadius } from "@/constants/theme";

type UVChartProps = {
  data: HourlyForecastEntry[];
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

function getPeakEntry(data: HourlyForecastEntry[]): HourlyForecastEntry {
  return data.reduce((peak, entry) => (entry.uv > peak.uv ? entry : peak), data[0]);
}

const MAX_BAR_HEIGHT = 100;
const MAX_UV_SCALE = 12; // roughly the highest UV value expected

export default function UVChart({ data }: UVChartProps) {
  if (data.length === 0) return null;

  const peak = getPeakEntry(data);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>UV Trend</Text>
        <Text style={styles.peakLabel}>
          Peak: {formatHour(peak.time)} ({peak.uv})
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartRow}>
          {data.map((entry, index) => {
            const isPeak = entry.time === peak.time;
            const barHeight = Math.max(
              4,
              (entry.uv / MAX_UV_SCALE) * MAX_BAR_HEIGHT,
            );

            return (
              <View key={index} style={styles.barColumn}>
                <Text style={[styles.uvLabel, isPeak && styles.uvLabelPeak]}>
                  {entry.uv}
                </Text>
                <View
                  style={[
                    styles.bar,
                    { height: barHeight, backgroundColor: getBarColor(entry.uv) },
                    isPeak && styles.barPeak,
                  ]}
                />
                <Text style={styles.hourLabel}>{formatHour(entry.time)}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: FigmaRadius.card,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: FigmaColors.textSecondary,
  },
  peakLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: FigmaColors.textMuted,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 14,
    height: MAX_BAR_HEIGHT + 40,
  },
  barColumn: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: 34,
    gap: 6,
  },
  uvLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: FigmaColors.textSecondary,
  },
  uvLabelPeak: {
    color: FigmaColors.textPrimary,
  },
  bar: {
    width: 16,
    borderRadius: 8,
  },
  barPeak: {
    borderWidth: 2,
    borderColor: FigmaColors.textPrimary,
  },
  hourLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: FigmaColors.textMuted,
  },
});