import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const SUNSCREEN_HOURS = [8, 10, 12, 14, 16]; // 8am, 10am, 12pm, 2pm, 4pm
const WATER_HOURS = [9, 11, 13, 15, 17]; // 9am, 11am, 1pm, 3pm, 5pm

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

export async function scheduleSunscreenReminders() {
  if (Platform.OS === "web") return;

  for (const hour of SUNSCREEN_HOURS) {
    await Notifications.cancelScheduledNotificationAsync(
      `sunscreen-${hour}`,
    ).catch(() => {});
  }

  for (const hour of SUNSCREEN_HOURS) {
    await Notifications.scheduleNotificationAsync({
      identifier: `sunscreen-${hour}`,
      content: {
        title: "Reapply Sunscreen ☀️",
        body: "Time to reapply SPF — protect your skin!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hour,
        minute: 0,
      },
    });
  }
}

export async function scheduleWaterReminders() {
  if (Platform.OS === "web") return;

  for (const hour of WATER_HOURS) {
    await Notifications.cancelScheduledNotificationAsync(`water-${hour}`).catch(
      () => {},
    );
  }

  for (const hour of WATER_HOURS) {
    await Notifications.scheduleNotificationAsync({
      identifier: `water-${hour}`,
      content: {
        title: "Stay Hydrated 💧",
        body: "Take a water break!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hour,
        minute: 0,
      },
    });
  }
}

export async function cancelAllReminders() {
  if (Platform.OS === "web") return;

  for (const hour of SUNSCREEN_HOURS) {
    await Notifications.cancelScheduledNotificationAsync(
      `sunscreen-${hour}`,
    ).catch(() => {});
  }
  for (const hour of WATER_HOURS) {
    await Notifications.cancelScheduledNotificationAsync(`water-${hour}`).catch(
      () => {},
    );
  }
}
