import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleSunscreenReminders, scheduleWaterReminders, cancelAllReminders } from "@/utils/notification";

const PREMIUM_KEY = "isPremiumMember";

export async function getIsPremium(): Promise<boolean> {
  const value = await AsyncStorage.getItem(PREMIUM_KEY);
  return value === "true";
}

export async function setPremium(status: boolean) {
  await AsyncStorage.setItem(PREMIUM_KEY, status ? "true" : "false");

  if (status) {
    await scheduleSunscreenReminders();
    await scheduleWaterReminders();
  } else {
    await cancelAllReminders();
  }
}