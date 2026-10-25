import CustomBotton from "@/src/components/CustomButton";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

const Home = () => {
  const { signOut, isSignedIn } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      router.replace("/");
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <View className="justify-center items-center bg-background flex-1 px-7">
      <Text className="text-primary font-semibold leading-tight">
        Welcome to Home Page
      </Text>
      <CustomBotton text="Sign out" onPress={handleSignOut} className="mt-4" />
    </View>
  );
};

export default Home;
