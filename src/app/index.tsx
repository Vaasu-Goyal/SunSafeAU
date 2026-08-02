import {useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

import Header from "@/components/Header";
import UVCard from "@/components/UVcard";
import AdviceCard from "@/components/Advicecard";

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

export default function HomeScreen() {
  const [uvIndex, setUvIndex] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationName, setLocationName] = useState("Getting location...");
  const [lastUpdated, setLastUpdated] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  async function fetchUV(latitude: number, longitude: number) {
    try {
      setLoading(true);

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=uv_index`
      );

      const data = await response.json();

      setUvIndex(Math.round(data.current.uv_index));

      const time = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    setLastUpdated(time);

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
        onIncrease={() => setUvIndex(Math.min(15, uvIndex + 1))}
        onDecrease={() => setUvIndex(Math.max(0, uvIndex - 1))}
      />

      <AdviceCard advice={getAdvice(uvIndex)} />
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