import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleSunscreenReminder, scheduleWaterReminder, cancelAllReminders } from "@/utils/notification";

const PREMIUM_KEY = "isPremiumMember";

export async function getIsPremium(): Promise<boolean> {
  const value = await AsyncStorage.getItem(PREMIUM_KEY);
  return value === "true";
}

export async function setPremium(status: boolean) {
  await AsyncStorage.setItem(PREMIUM_KEY, status ? "true" : "false");

  if (status) {
    await scheduleSunscreenReminder();
    await scheduleWaterReminder();
  } else {
    await cancelAllReminders();
  }
}