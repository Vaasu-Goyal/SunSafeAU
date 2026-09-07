import { SkinType, getSkinTypeInfo } from "@/types/skin";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SKIN_TYPE_KEY = "userSkinType";

export async function getSkinType(): Promise<SkinType | null> {
  const value = await AsyncStorage.getItem(SKIN_TYPE_KEY);
  if (
    value === "I" ||
    value === "II" ||
    value === "III" ||
    value === "IV" ||
    value === "V" ||
    value === "VI"
  ) {
    return value;
  }
  return null;
}

export async function setSkinType(type: SkinType) {
  await AsyncStorage.setItem(SKIN_TYPE_KEY, type);
}

const MIN_UV_FOR_BURN_ESTIMATE = 1;

export function getMinutesToBurn(
  skinType: SkinType,
  uvIndex: number,
): number | null {
  if (uvIndex < MIN_UV_FOR_BURN_ESTIMATE) {
    return null;
  }
  const { baseMinutesAtUvOne } = getSkinTypeInfo(skinType);
  return Math.round(baseMinutesAtUvOne / uvIndex);
}

export function formatBurnTime(minutes: number | null): string {
  if (minutes === null) return "No burn risk right now";
  if (minutes < 60) return `~${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `~${hours} hr`;
  return `~${hours} hr ${remainingMinutes} min`;
}


const EXPOSURE_KEY = "cumulativeBurnFraction";

// How much of the "burn budget" has been used, 0 = none, 1 = burn threshold reached
export async function getExposureFraction(): Promise<number> {
  const value = await AsyncStorage.getItem(EXPOSURE_KEY);
  const parsed = value ? parseFloat(value) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

// Call periodically (e.g. every minute) while the user is "in sun mode"
export async function tickExposure(
  skinType: SkinType,
  uvIndex: number,
  elapsedMinutes: number,
): Promise<number> {
  const minutesToBurn = getMinutesToBurn(skinType, uvIndex);

  // UV too low to matter — don't accumulate, don't move the gauge
  if (minutesToBurn === null) {
    return getExposureFraction();
  }

  const current = await getExposureFraction();
  const additionalFraction = elapsedMinutes / minutesToBurn;
  const next = Math.min(1, current + additionalFraction);

  await AsyncStorage.setItem(EXPOSURE_KEY, next.toString());
  return next;
}

// "I just reapplied sunscreen" — zero the gauge back out
export async function resetExposure(): Promise<void> {
  await AsyncStorage.setItem(EXPOSURE_KEY, "0");
}