import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { RefreshControl } from "react-native";

import AdviceCard from "@/components/Advicecard";
import Header from "@/components/Header";
import HourlyForecast from "@/components/HourlyForecast";
import UVCard from "@/components/UVcard";
import UVChart from "@/components/uvchart";
import SunProtectionCard from "@/components/SunProtectionCard";
import PremiumBanner from "@/components/PremiumBanner";
import { HourlyForecastEntry, OpenMeteoResponse } from "@/types/weather";
import { getIsPremium } from "@/utils/premium";
import { Ionicons } from "@expo/vector-icons";

import { SkinType } from "@/types/skin";
import {
  getSkinType,
  setSkinType,
  getMinutesToBurn,
  tickExposure,
  resetExposure,
} from "@/utils/skin";

function getUvLevel(uv: number) {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}

function getAdvice(uv: number): string[] {
  if (uv <= 2) return ["Enjoy the sunshine", "Wear sunglasses"];
  if (uv <= 5) return ["Apply SPF 30+", "Drink water"];
  if (uv <= 7) return ["Wear a hat", "Apply SPF 50+", "Stay hydrated"];
  return [
    "Avoid direct sunlight",
    "Stay indoors if possible",
    "Reapply sunscreen every 2 hours",
  ];
}

function getUvColor(uv: number): string {
  if (uv <= 2) return "#4CAF50";
  if (uv <= 5) return "#FBC02D";
  if (uv <= 7) return "#FB8C00";
  if (uv <= 10) return "#E53935";
  return "#8E24AA";
}

function getWeatherCondition(code: number): string {
  if (code === 0) return "Sunny";
  if (code === 1) return "Mostly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  return "Unknown";
}

function getWeatherIcon(code: number): keyof typeof Ionicons.glyphMap {
  if (code === 0) return "sunny";
  if (code === 1) return "partly-sunny";
  if (code === 2) return "partly-sunny";
  if (code === 3) return "cloud";
  if (code >= 51 && code <= 67) return "rainy";
  if (code >= 71 && code <= 77) return "snow";
  return "help-circle";
}

export default function HomeScreen() {
  const [uvIndex, setUvIndex] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationName, setLocationName] = useState("Getting location...");
  const [lastUpdated, setLastUpdated] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [temperature, setTemperature] = useState(0);
  const [weatherCode, setWeatherCode] = useState(0);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastEntry[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [skinType, setSkinTypeState] = useState<SkinType | null>(null);
  const [remainingBurnMinutes, setRemainingBurnMinutes] = useState<number | null>(null);

  const lastTickRef = useRef<number>(Date.now());
  const hasBurnedRef = useRef(false);

  async function fetchUV(latitude: number, longitude: number) {
    try {
      setLoading(true);

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=uv_index,temperature_2m,weather_code&hourly=uv_index,temperature_2m,weather_code&forecast_days=2&timezone=auto`,
      );

      const data: OpenMeteoResponse = await response.json();

      setUvIndex(Math.round(data.current.uv_index));
      setTemperature(Math.round(data.current.temperature_2m));
      setWeatherCode(data.current.weather_code);

      const time = new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      setLastUpdated(time);

      const hourlyTimes = data.hourly.time;
      const hourlyUv = data.hourly.uv_index;
      const hourlyTemp = data.hourly.temperature_2m;
      const hourlyWeather = data.hourly.weather_code;
      const currentTime: string = data.current.time;

      const upcoming = hourlyTimes
        .map((t, i) => ({
          time: t,
          uv: Math.round(hourlyUv[i]),
          temp: Math.round(hourlyTemp[i]),
          weatherCode: hourlyWeather[i],
        }))
        .filter((entry) => entry.time >= currentTime)
        .slice(0, 8);

      setHourlyForecast(upcoming);
    } catch {
      setError("Unable to fetch UV data");
    } finally {
      setLoading(false);
    }
  }

  async function getLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Location permission denied");
        return;
      }

      let currentLocation = await Location.getLastKnownPositionAsync();

      if (!currentLocation) {
        currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      }

      const { latitude, longitude } = currentLocation.coords;
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (address.length > 0) {
        const place = address[0];
        setLocationName(`${place.city ?? "Unknown"}, ${place.region ?? ""}`);
      }
      await fetchUV(latitude, longitude);
    } catch (err) {
      console.log(err);
      setError("Unable to get location");
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await getLocation();
    setRefreshing(false);
  }

  async function handleSelectSkinType(type: SkinType) {
    await setSkinType(type);
    setSkinTypeState(type);
  }

  async function handleReapply() {
    await resetExposure();
    setRemainingBurnMinutes(null);
    hasBurnedRef.current = false;
    lastTickRef.current = Date.now();
  }

  useEffect(() => {
    getLocation();
    const interval = setInterval(() => {
      getLocation();
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getIsPremium().then(setIsPremium);
      getSkinType().then(setSkinTypeState);
    }, []),
  );

  // Burn exposure ticking — only runs for premium users with a skin type set
  useEffect(() => {
    if (!isPremium || !skinType) {
      setRemainingBurnMinutes(null);
      return;
    }

    let cancelled = false;
    lastTickRef.current = Date.now();
    hasBurnedRef.current = false;

    async function runTick() {
      const now = Date.now();
      const elapsedMinutes = (now - lastTickRef.current) / 60000;
      lastTickRef.current = now;

      const fraction = await tickExposure(skinType!, uvIndex, elapsedMinutes);
      if (cancelled) return;

      const totalMinutes = getMinutesToBurn(skinType!, uvIndex);
      if (totalMinutes === null) {
        setRemainingBurnMinutes(null);
        return;
      }

      const remaining = Math.max(0, Math.round(totalMinutes * (1 - fraction)));
      setRemainingBurnMinutes(remaining);

      if (fraction >= 1 && !hasBurnedRef.current) {
        hasBurnedRef.current = true;
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Reapply Sunscreen Now ☀️",
            body: "Your estimated burn window has ended.",
          },
          trigger: null,
        });
      } else if (fraction < 1) {
        hasBurnedRef.current = false;
      }
    }

    runTick();
    const interval = setInterval(runTick, 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isPremium, skinType, uvIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Header location={locationName} lastUpdated={lastUpdated} isPremium={isPremium} />

        <UVCard
          uvIndex={uvIndex}
          loading={loading}
          error={error}
          level={getUvLevel(uvIndex)}
          color={getUvColor(uvIndex)}
          onRefresh={onRefresh}
          temperature={temperature}
          weather={getWeatherCondition(weatherCode)}
          weatherIcon={getWeatherIcon(weatherCode)}
        />

        <SunProtectionCard
          skinType={skinType}
          onSelectSkinType={handleSelectSkinType}
          isPremium={isPremium}
          uvColor={getUvColor(uvIndex)}
          uvIndex={uvIndex}
        />

        <HourlyForecast
          data={hourlyForecast}
          getWeatherIcon={getWeatherIcon}
          getUvColor={getUvColor}
        />

        <UVChart data={hourlyForecast} />

        <AdviceCard advice={getAdvice(uvIndex)} />

        <PremiumBanner isPremium={isPremium} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffeb99",
    justifyContent: "center",
    padding: 20,
  },
});