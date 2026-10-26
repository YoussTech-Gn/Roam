import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import "../../global.css";
import { queryClient } from "../utils/query/client";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <GluestackUIProvider mode="dark">
          <Slot />
        </GluestackUIProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
