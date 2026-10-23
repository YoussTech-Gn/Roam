import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const signUp = () => {
  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "android" ? "height" : "padding"}
      >
        <View className="flex-1 justify-center">
          <Image
            source={require("@/assets/images/welth.png")}
            className="w-36 h-16 mb-8"
            resizeMode="contain"
            resizeMethod="none"
          />
         <Text
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default signUp;
