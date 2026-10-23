// app/index.tsx
import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded) SplashScreen.hideAsync();
  }, [isLoaded]);

  if (!isLoaded) return null; // native splash is still covering the screen

  return (
    <Redirect href={isSignedIn ? "/(secured)/(tabs)" : "/(auth)/sign-in"} />
  );
}
