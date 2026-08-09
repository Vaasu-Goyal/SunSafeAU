import {useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

import Header from "@/components/Header";
import UVCard from "@/components/UVcard";
import AdviceCard from "@/components/Advicecard";
import { Ionicons } from "@expo/vector-icons";
import HourlyForecast from "@/components/HourlyForecast";
import UVChart from "@/components/uvchart";
import { requestNotificationPermission, sendTestNotification } from "@/utils/notification";
import { getIsPremium, setPremium } from "@/utils/premium";

function getUvLevel(uv: number) {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}

function getAdvice(uv: number): string[] {
  if (uv <= 2) {
    return [
      "Enjoy the sunshine",
      "Wear sunglasses",
    ];
  }

  if (uv <= 5) {
    return [
      "Apply SPF 30+",
      "Drink water",
    ];
  }

  if (uv <= 7) {
    return [
      "Wear a hat",
      "Apply SPF 50+",
      "Stay hydrated",
    ];
  }

  return [
    "Avoid direct sunlight",
    "Stay indoors if possible",
    "Reapply sunscreen every 2 hours",
  ];
}

function getUvColor(uv: number): string {
  if (uv <= 2) return "#4CAF50";   // Green

  if (uv <= 5) return "#FBC02D";   // Yellow

  if (uv <= 7) return "#FB8C00";   // Orange

  if (uv <= 10) return "#E53935";  // Red

  return "#8E24AA";                // Purple
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

async function handleTestNotification() {
  const granted = await requestNotificationPermission();
  if (granted) {
    await sendTestNotification();
  } else {
    console.log("Notification permission denied");
  }
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
  const [hourlyForecast, setHourlyForecast] = useState<
    { time: string; uv: number; temp: number; weatherCode: number }[]
  >([]);
  const [isPremium, setIsPremium] = useState(false);

  async function fetchUV(latitude: number, longitude: number) {
    try {
      
      setLoading(true);

      const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=uv_index,temperature_2m,weather_code&hourly=uv_index,temperature_2m,weather_code&forecast_days=2&timezone=auto`
      );
      
      const data = await response.json();
      console.log("Full API response:", JSON.stringify(data.hourly, null, 2));

      setUvIndex(Math.round(data.current.uv_index));
      setTemperature(Math.round(data.current.temperature_2m));
      setWeatherCode(data.current.weather_code);

      const time = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    setLastUpdated(time);

    const hourlyTimes: string[] = data.hourly.time;
    const hourlyUv: number[] = data.hourly.uv_index;
    const hourlyTemp: number[] = data.hourly.temperature_2m;
    const hourlyWeather: number[] = data.hourly.weather_code;
  

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
    const address = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    console.log(address);

    if (address.length > 0) {
    const place = address[0];

    setLocationName(
      `${place.city ?? "Unknown"}, ${place.region ?? ""}`
    );
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
useEffect(() => {
  getLocation();
    const interval = setInterval(() => {
    getLocation();
  }, 15 * 60 * 1000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  getIsPremium().then(setIsPremium);
}, []);


  return (
    <SafeAreaView style={styles.container}>
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      >
      <Header location={locationName} 
       lastUpdated={lastUpdated}
       />

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
      <HourlyForecast
      data={hourlyForecast}
      getWeatherIcon={getWeatherIcon}
      getUvColor={getUvColor}
    />

    <UVChart data={hourlyForecast} />


      <AdviceCard advice={getAdvice(uvIndex)} />

        {__DEV__ && (
  <>
    <Pressable
      onPress={handleTestNotification}
      style={{
        padding: 16,
        backgroundColor: "#3B82F6",
        borderRadius: 12,
        margin: 20,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "600" }}>Test Notification</Text>
    </Pressable>

    <Pressable
      onPress={async () => {
        await setPremium(true);
        setIsPremium(true);
      }}
      style={{
        padding: 16,
        backgroundColor: "#10B981",
        borderRadius: 12,
        margin: 20,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "600" }}>
        {isPremium ? "✓ Premium Active" : "Simulate Purchase ($10 AUD)"}
      </Text>
    </Pressable>

    <Pressable
      onPress={async () => {
        await setPremium(false);
        setIsPremium(false);
      }}
      style={{
        padding: 12,
        backgroundColor: "#EF4444",
        borderRadius: 12,
        margin: 20,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "600" }}>Reset Premium (dev only)</Text>
    </Pressable>
  </>
)}
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