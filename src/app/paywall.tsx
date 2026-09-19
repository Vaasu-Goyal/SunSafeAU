import { router } from "expo-router";
import PaywallScreen from "@/components/PayWallScreen";
import { setPremium } from "@/utils/premium";

export default function PaywallRoute() {
  return (
    <PaywallScreen
      onClose={() => router.back()}
      onSubscribe={async () => {
        await setPremium(true); // dev/simulated purchase for now
        router.back();
      }}
    />
  );
}