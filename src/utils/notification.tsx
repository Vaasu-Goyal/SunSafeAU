import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return true;
}

export async function sendTestNotification() {
  if (Platform.OS === "web") return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "SunSafeAU Test",
      body: "If you see this, notifications are working! ☀️",
    },
    trigger: null,
  });
}

export async function scheduleSunscreenReminder() {
  if (Platform.OS === "web") return;

  await Notifications.cancelScheduledNotificationAsync("sunscreen-reminder").catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: "sunscreen-reminder",
    content: {
      title: "Reapply Sunscreen ☀️",
      body: "It's been 2 hours — time to reapply SPF!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2 * 60 * 60,
      repeats: true,
    },
  });
}

export async function scheduleWaterReminder() {
  if (Platform.OS === "web") return;

  await Notifications.cancelScheduledNotificationAsync("water-reminder").catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: "water-reminder",
    content: {
      title: "Stay Hydrated 💧",
      body: "Take a water break!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60 * 60,
      repeats: true,
    },
  });
}

export async function cancelAllReminders() {
  if (Platform.OS === "web") return;

  await Notifications.cancelScheduledNotificationAsync("sunscreen-reminder").catch(() => {});
  await Notifications.cancelScheduledNotificationAsync("water-reminder").catch(() => {});
}