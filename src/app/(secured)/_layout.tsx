import { useAuth } from "@clerk/expo";
import { Redirect, Slot } from "expo-router";

const SecuredLayout = () => {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return <Redirect href={"/(auth)/sign-in"} />;

  return <Slot />;
};
