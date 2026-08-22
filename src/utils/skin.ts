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
