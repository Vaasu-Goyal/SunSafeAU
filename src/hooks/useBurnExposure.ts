import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";

import { SkinType } from "@/types/skin";
import {
  getExposureFraction,
  getMinutesToBurn,
  resetExposure as resetExposureStorage,
  tickExposure,
} from "@/utils/skin";

const TICK_INTERVAL_MS = 60 * 1000; // check in every minute

export function useBurnExposure(skinType: SkinType | null, uvIndex: number) {
  const [exposureFraction, setExposureFraction] = useState(0);
  const lastTickRef = useRef(Date.now());
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    getExposureFraction().then(setExposureFraction);
  }, []);

  useEffect(() => {
    if (!skinType) return;

    const interval = setInterval(async () => {
      const now = Date.now();
      const elapsedMinutes = (now - lastTickRef.current) / 60000;
      lastTickRef.current = now;

      const next = await tickExposure(skinType, uvIndex, elapsedMinutes);
      setExposureFraction(next);

      if (next >= 1 && !hasNotifiedRef.current) {
        hasNotifiedRef.current = true;
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Reapply Sunscreen Now ☀️",
            body: "Your estimated burn window has ended.",
          },
          trigger: null,
        });
      } else if (next < 1) {
        hasNotifiedRef.current = false;
      }
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [skinType, uvIndex]);

  async function resetExposure() {
    await resetExposureStorage();
    lastTickRef.current = Date.now();
    hasNotifiedRef.current = false;
    setExposureFraction(0);
  }

  const minutesToBurn = skinType ? getMinutesToBurn(skinType, uvIndex) : null;

  return { exposureFraction, minutesToBurn, resetExposure };
}