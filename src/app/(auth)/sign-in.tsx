import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const signInPage = () => {
  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "android" ? "height" : "padding"}
      >
        <View>
          <TextInput placeholder="blahhh " className="border-4 border-black" />
          <Text className="fill-blue-950 font-bold">HHhh</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default signInPage;
