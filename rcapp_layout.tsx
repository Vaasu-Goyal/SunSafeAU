[1mdiff --git a/app.json b/app.json[m
[1mindex f63f9cd..37fea82 100644[m
[1m--- a/app.json[m
[1m+++ b/app.json[m
[36m@@ -7,36 +7,8 @@[m
     "icon": "./assets/images/icon.png",[m
     "scheme": "sunsafeau",[m
     "userInterfaceStyle": "automatic",[m
[31m-    "ios": {[m
[31m-      "icon": "./assets/expo.icon"[m
[31m-    },[m
[31m-    "android": {[m
[31m-      "adaptiveIcon": {[m
[31m-        "backgroundColor": "#E6F4FE",[m
[31m-        "foregroundImage": "./assets/images/android-icon-foreground.png",[m
[31m-        "backgroundImage": "./assets/images/android-icon-background.png",[m
[31m-        "monochromeImage": "./assets/images/android-icon-monochrome.png"[m
[31m-      },[m
[31m-      "predictiveBackGestureEnabled": false[m
[31m-    },[m
[31m-    "web": {[m
[31m-      "output": "static",[m
[31m-      "favicon": "./assets/images/favicon.png"[m
[31m-    },[m
     "plugins": [[m
[31m-      "expo-router",[m
[31m-      [[m
[31m-        "expo-splash-screen",[m
[31m-        {[m
[31m-          "backgroundColor": "#208AEF",[m
[31m-          "image": "./assets/images/splash-icon.png",[m
[31m-          "imageWidth": 76[m
[31m-        }[m
[31m-      ][m
[31m-    ],[m
[31m-    "experiments": {[m
[31m-      "typedRoutes": true,[m
[31m-      "reactCompiler": true[m
[31m-    }[m
[32m+[m[32m      "expo-router"[m
[32m+[m[32m    ][m
   }[m
[31m-}[m
[32m+[m[32m}[m
\ No newline at end of file[m
[1mdiff --git a/src/app/index.tsx b/src/app/index.tsx[m
[1mindex 0186272..4f24a76 100644[m
[1m--- a/src/app/index.tsx[m
[1m+++ b/src/app/index.tsx[m
[36m@@ -10,6 +10,7 @@[m [mimport * as Location from "expo-location";[m
 import Header from "@/components/Header";[m
 import UVCard from "@/components/UVcard";[m
 import AdviceCard from "@/components/Advicecard";[m
[32m+[m[32mimport { Ionicons } from "@expo/vector-icons";[m
 [m
 function getUvLevel(uv: number) {[m
   if (uv <= 2) return "Low";[m
[36m@@ -61,6 +62,39 @@[m [mfunction getUvColor(uv: number): string {[m
   return "#8E24AA";                // Purple[m
 }[m
 [m
[32m+[m[32mfunction getWeatherCondition(code: number): string {[m
[32m+[m[32m  if (code === 0) return "Sunny";[m
[32m+[m
[32m+[m[32m  if (code === 1) return "Mostly Clear";[m
[32m+[m
[32m+[m[32m  if (code === 2) return "Partly Cloudy";[m
[32m+[m
[32m+[m[32m  if (code === 3) return "Cloudy";[m
[32m+[m
[32m+[m[32m  if (code >= 51 && code <= 67) return "Rain";[m
[32m+[m
[32m+[m[32m  if (code >= 71 && code <= 77) return "Snow";[m
[32m+[m
[32m+[m[32m  return "Unknown";[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mfunction getWeatherIcon(code: number): keyof typeof Ionicons.glyphMap {[m
[32m+[m[32m  if (code === 0) return "sunny";[m
[32m+[m
[32m+[m[32m  if (code === 1) return "partly-sunny";[m
[32m+[m
[32m+[m[32m  if (code === 2) return "partly-sunny";[m
[32m+[m
[32m+[m[32m  if (code === 3) return "cloud";[m
[32m+[m
[32m+[m[32m  if (code >= 51 && code <= 67) return "rainy";[m
[32m+[m
[32m+[m[32m  if (code >= 71 && code <= 77) return "snow";[m
[32m+[m
[32m+[m[32m  return "help-circle";[m
[32m+[m[32m}[m
[32m+[m
[32m+[m
 export default function HomeScreen() {[m
   const [uvIndex, setUvIndex] = useState(8);[m
   const [loading, setLoading] = useState(true);[m
[36m@@ -68,18 +102,22 @@[m [mexport default function HomeScreen() {[m
   const [locationName, setLocationName] = useState("Getting location...");[m
   const [lastUpdated, setLastUpdated] = useState("");[m
   const [refreshing, setRefreshing] = useState(false);[m
[32m+[m[32m  const [temperature, setTemperature] = useState(0);[m
[32m+[m[32m  const [weatherCode, setWeatherCode] = useState(0);[m
 [m
   async function fetchUV(latitude: number, longitude: number) {[m
     try {[m
       setLoading(true);[m
 [m
       const response = await fetch([m
[31m-        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=uv_index`[m
[31m-      );[m
[31m-[m
[32m+[m[32m  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=uv_index,temperature_2m,weather_code`[m
[32m+[m[32m);[m
[32m+[m[41m      [m
       const data = await response.json();[m
 [m
       setUvIndex(Math.round(data.current.uv_index));[m
[32m+[m[32m      setTemperature(Math.round(data.current.temperature_2m));[m
[32m+[m[32m      setWeatherCode(data.current.weather_code);[m
 [m
       const time = new Date().toLocaleTimeString([], {[m
       hour: "numeric",[m
[36m@@ -172,6 +210,9 @@[m [museEffect(() => {[m
         level={getUvLevel(uvIndex)}[m
         color={getUvColor(uvIndex)}[m
         onRefresh={onRefresh}[m
[32m+[m[32m        temperature={temperature}[m
[32m+[m[32m        weather={getWeatherCondition(weatherCode)}[m
[32m+[m[32m        weatherIcon={getWeatherIcon(weatherCode)}[m
     [m
       />[m
 [m
[1mdiff --git a/src/components/UVcard.tsx b/src/components/UVcard.tsx[m
[1mindex 0c44411..b33a433 100644[m
[1m--- a/src/components/UVcard.tsx[m
[1m+++ b/src/components/UVcard.tsx[m
[36m@@ -8,6 +8,9 @@[m [mtype UVCardProps = {[m
   level: string;[m
   color: string; [m
   onRefresh: () => void;[m
[32m+[m[32m  temperature: number;[m
[32m+[m[32m  weather: string;[m
[32m+[m[32m  weatherIcon: keyof typeof Ionicons.glyphMap;[m
 };[m
 [m
 export default function UVCard({[m
[36m@@ -17,6 +20,9 @@[m [mexport default function UVCard({[m
   level,[m
   color,[m
   onRefresh,[m
[32m+[m[32m  temperature,[m
[32m+[m[32m  weather,[m
[32m+[m[32m  weatherIcon[m
 [m
 }: UVCardProps) {[m
   return ([m
[36m@@ -32,12 +38,31 @@[m [mexport default function UVCard({[m
     <Text style={[styles.uv, { color }]}>{uvIndex}</Text>[m
   )}[m
 [m
[31m-  <Text style={[styles.level, { color }]}>[m
[31m-    {level}[m
[31m-  </Text>[m
 [m
   {error ? <Text style={styles.error}>{error}</Text> : null}[m
 [m
[32m+[m[32m  <Text style={[styles.level, { color }]}>[m
[32m+[m[32m  {level}[m
[32m+[m[32m</Text>[m
[32m+[m
[32m+[m[32m<View style={styles.tempRow}>[m
[32m+[m[32m  <Feather name="thermometer" size={16} color="#64748B" />[m
[32m+[m[32m  <Text style={styles.tempText}>{temperature}°C</Text>[m
[32m+[m[32m</View>[m
[32m+[m
[32m+[m[32m{error ? <Text style={styles.error}>{error}</Text> : null}[m
[32m+[m
[32m+[m[32m<View style={styles.weatherRow}>[m
[32m+[m[32m  <Ionicons[m
[32m+[m[32m    name={weatherIcon}[m
[32m+[m[32m    size={20}[m
[32m+[m[32m    color="#64748B"[m
[32m+[m[32m  />[m
[32m+[m[32m  <Text style={styles.weather}>[m
[32m+[m[32m    {weather}[m
[32m+[m[32m  </Text>[m
[32m+[m[32m</View>[m
[32m+[m
   <View style={styles.buttonContainer}>[m
   <Pressable[m
     style={({ pressed }) => [[m
[36m@@ -123,4 +148,26 @@[m [mconst styles = StyleSheet.create({[m
     fontSize: 16,[m
     fontWeight: "600",[m
   },[m
[32m+[m[32m  tempRow: {[m
[32m+[m[32m  flexDirection: "row",[m
[32m+[m[32m  alignItems: "center",[m
[32m+[m[32m  gap: 6,[m
[32m+[m[32m  marginTop: 8,[m
[32m+[m[32m},[m
[32m+[m
[32m+[m[32mtempText: {[m
[32m+[m[32m  fontSize: 16,[m
[32m+[m[32m  color: "#64748B",[m
[32m+[m[32m},[m
[32m+[m[32mweatherRow: {[m
[32m+[m[32m  flexDirection: "row",[m
[32m+[m[32m  alignItems: "center",[m
[32m+[m[32m  marginTop: 10,[m
[32m+[m[32m  gap: 6,[m
[32m+[m[32m},[m
[32m+[m
[32m+[m[32mweather: {[m
[32m+[m[32m  fontSize: 18,[m
[32m+[m[32m  color: "#475569",[m
[32m+[m[32m},[m
 });[m
\ No newline at end of file[m
[1mdiff --git a/tsconfig.json b/tsconfig.json[m
[1mindex 2e9a669..d6da3c9 100644[m
[1m--- a/tsconfig.json[m
[1m+++ b/tsconfig.json[m
[36m@@ -13,8 +13,6 @@[m
   },[m
   "include": [[m
     "**/*.ts",[m
[31m-    "**/*.tsx",[m
[31m-    ".expo/types/**/*.ts",[m
[31m-    "expo-env.d.ts"[m
[32m+[m[32m    "**/*.tsx"[m
   ][m
 }[m
