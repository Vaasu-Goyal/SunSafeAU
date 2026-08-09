import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HourlyForecastEntry } from "@/types/weather"; 


type HourlyForecastProps = {
  data: HourlyForecastEntry[];
  getWeatherIcon: (code: number) => keyof typeof Ionicons.glyphMap;
  getUvColor: (uv: number) => string;
};

function formatHour(isoTime: string): string {
  const hour = parseInt(isoTime.split("T")[1].split(":")[0], 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}${period}`;
}

export default function HourlyForecast({
  data,
  getWeatherIcon,
  getUvColor,
}: HourlyForecastProps) {
  if (data.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hourly Forecast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((entry, index) => (
          <View key={index} style={styles.hourCard}>
            <Text style={styles.hourText}>{formatHour(entry.time)}</Text>
            <Ionicons
              name={getWeatherIcon(entry.weatherCode)}
              size={22}
              color="#64748B"
            />
            <Text style={[styles.uvText, { color: getUvColor(entry.uv) }]}>
              {entry.uv}
            </Text>
            <Text style={styles.tempText}>{entry.temp}°</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 10,
    marginLeft: 4,
  },
  scrollContent: {
    gap: 10,
    paddingHorizontal: 4,
  },
  hourCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    minWidth: 64,
    elevation: 3,
  },
  hourText: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 6,
  },
  uvText: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },
  tempText: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
});