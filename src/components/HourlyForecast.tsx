import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HourlyForecastEntry } from "@/types/weather";
import { FigmaColors, FigmaRadius } from "@/constants/theme";

type HourlyForecastProps = {
  data: HourlyForecastEntry[];
  getWeatherIcon: (code: number) => keyof typeof Ionicons.glyphMap;
};

function formatHour(isoTime: string): string {
  const hour = parseInt(isoTime.split("T")[1].split(":")[0], 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}${period}`;
}

function getWeatherIconForHour(
  code: number,
  isNight: boolean,
  getWeatherIcon: (code: number) => keyof typeof Ionicons.glyphMap,
): keyof typeof Ionicons.glyphMap {
  if (isNight && (code === 0 || code === 1)) return "moon";
  if (isNight && code === 2) return "cloudy-night"; // no distinct partly-cloudy-night icon; falls back safely
  return getWeatherIcon(code);
}

function getIconBadgeColor(code: number, isNight: boolean): string {
  if (isNight) {
    if (code === 0 || code === 1) return "#5B6B9E";
    if (code === 2) return "#7C8AA8";
  }
  if (code === 0 || code === 1) return "#FDB750";
  if (code === 2) return "#F0C987";
  if (code === 3) return "#CBD5E1";
  if (code >= 51 && code <= 67) return "#93C5FD";
  if (code >= 71 && code <= 77) return "#E2E8F0";
  return FigmaColors.chipInactiveBg;
}

export default function HourlyForecast({ data, getWeatherIcon }: HourlyForecastProps) {
  if (data.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hourly Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {data.map((entry, index) => (
          <View key={index} style={styles.hourCard}>
            <Text style={styles.hourText}>{formatHour(entry.time)}</Text>

            <View style={[styles.iconBadge, { backgroundColor: getIconBadgeColor(entry.weatherCode, entry.isNight) }]}>
              <Ionicons
                name={getWeatherIconForHour(entry.weatherCode, entry.isNight, getWeatherIcon)}
                size={18}
                color="white"
              />
            </View>

            <Text style={styles.tempText}>{entry.temp}°</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  title: { fontSize: 16, fontWeight: "600", color: FigmaColors.textSecondary, marginBottom: 10, marginLeft: 4 },
  scrollContent: { gap: 10, paddingHorizontal: 4 },
  hourCard: {
    backgroundColor: "white",
    borderRadius: FigmaRadius.small,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: "center",
    minWidth: 68,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  hourText: { fontSize: 12, fontWeight: "600", color: FigmaColors.textMuted },
  iconBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  tempText: { fontSize: 15, fontWeight: "700", color: FigmaColors.textPrimary },
});