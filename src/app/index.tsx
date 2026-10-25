// app/index.tsx
import { useAuth } from "@clerk/expo";
import { Redirect, SplashScreen } from "expo-router";
import { useEffect } from "react";

export default function RootIndex() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded) SplashScreen.hideAsync();
  }, [isLoaded]);

  if (!isLoaded) return null; // native splash is still covering the screen

  return (
    <Redirect href={isSignedIn ? "/(secured)/(tabs)" : "/(auth)/sign-up"} />
  );
}
