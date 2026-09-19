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

const ONE_DAY_SECONDS = 24 * 60 * 60;

let notificationListenerSubscription: Notifications.Subscription | null = null;

// Reschedule daily reminders the moment they fire, since TIME_INTERVAL
// (our Android DAILY-bug workaround) doesn't repeat on its own.
// Call this once per app session (see _layout.tsx) — NOT at module load,
// since Fast Refresh in dev client would otherwise stack duplicate listeners
// on every save, causing rapid repeat notifications.
export function setupNotificationRescheduleListener() {
  if (Platform.OS === "web") return;
  if (notificationListenerSubscription) return; // already registered this session

  notificationListenerSubscription = Notifications.addNotificationReceivedListener(
    async (event) => {
      const identifier = event.request.identifier;
      if (!identifier) return;
      if (!identifier.startsWith("sunscreen-") && !identifier.startsWith("water-")) return;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: event.request.content.title ?? "",
          body: event.request.content.body ?? "",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: ONE_DAY_SECONDS,
          repeats: false,
        },
      });
    },
  );
}

function secondsUntil(hour: number, minute: number): number {
  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);

  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  return Math.max(1, Math.round((target.getTime() - now.getTime()) / 1000));
}

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
    const identifier = `sunscreen-${hour}`;
    await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {});

    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title: "Reapply Sunscreen ☀️",
        body: "Time to reapply SPF — protect your skin!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntil(hour, 0),
        repeats: false,
      },
    });
  }
}

export async function scheduleWaterReminders() {
  if (Platform.OS === "web") return;

  for (const hour of WATER_HOURS) {
    const identifier = `water-${hour}`;
    await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {});

    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title: "Stay Hydrated 💧",
        body: "Take a water break!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntil(hour, 0),
        repeats: false,
      },
    });
  }
}

export async function cancelAllReminders() {
  if (Platform.OS === "web") return;

  for (const hour of SUNSCREEN_HOURS) {
    await Notifications.cancelScheduledNotificationAsync(`sunscreen-${hour}`).catch(() => {});
  }
  for (const hour of WATER_HOURS) {
    await Notifications.cancelScheduledNotificationAsync(`water-${hour}`).catch(() => {});
  }
}