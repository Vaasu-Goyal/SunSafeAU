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
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "SunSafeAU Test",
      body: "If you see this, notifications are working! ☀️",
    },
    trigger: null, // null = fire immediately
  });
}

export async function scheduleSunscreenReminder() {
  await Notifications.cancelScheduledNotificationAsync("sunscreen-reminder").catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: "sunscreen-reminder",
    content: {
      title: "Reapply Sunscreen ☀️",
      body: "It's been 2 hours — time to reapply SPF!",
    },
    trigger: {
      seconds: 2 * 60 * 60,
      repeats: true,
    } as Notifications.TimeIntervalTriggerInput,
  });
}

export async function scheduleWaterReminder() {
  await Notifications.cancelScheduledNotificationAsync("water-reminder").catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: "water-reminder",
    content: {
      title: "Stay Hydrated 💧",
      body: "Take a water break!",
    },
    trigger: {
      seconds: 60 * 60,
      repeats: true,
    } as Notifications.TimeIntervalTriggerInput,
  });
}

export async function cancelAllReminders() {
  await Notifications.cancelScheduledNotificationAsync("sunscreen-reminder").catch(() => {});
  await Notifications.cancelScheduledNotificationAsync("water-reminder").catch(() => {});
}