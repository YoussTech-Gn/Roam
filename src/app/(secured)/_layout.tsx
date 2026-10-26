import { useUserSync } from "@/hooks/useUserSync";
import CustomBotton from "@/src/components/CustomButton";
import { useUserStore } from "@/store/userStore";
import { useAuth } from "@clerk/expo";
import { Redirect, Slot, usePathname } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

export default function RootGroupLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const needsOnboarding = useUserStore((s) => s.needsOnboarding);
  const syncFailed = useUserStore((s) => s.syncFailed);
  const pathname = usePathname();

  const { retry } = useUserSync();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/sign-in" />;

  if (syncFailed)
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-foreground text-lg font-bold mb-2">
          Couldn&apos;t load your account
        </Text>
        <Text className="text-muted-foreground text-center mb-6">
          Check your connection and try again.
        </Text>
        <CustomBotton text="Try again" onPress={retry} />
      </View>
    );

  if (needsOnboarding === null)
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );

  if (needsOnboarding && pathname.toLowerCase() !== "/onboarding")
    return <Redirect href="/(secured)/onBoarding" />;

  return <Slot />;
}
