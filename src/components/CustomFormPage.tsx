import { Link } from "expo-router";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomBotton from "./CustomButton";
import CustomInput from "./InputField";
import { Heading } from "./ui/heading";

type Props<V extends FieldValues> = {
  control: Control<V>;
  press: () => void;
  page: "signIn" | "signUp";
  isPending: boolean;
};

const CustomFormPage = <V extends FieldValues>({
  control,
  page,
  isPending,
  press,
}: Props<V>) => {
  const isSignUp = page === "signUp";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "height" : "padding"}
      className="flex-1 bg-background"
    >
      <View className="flex-1 justify-center px-6 -mt-16">
        <Image
          source={require("@/assets/images/welth.png")}
          className="w-37 h-17 mb-6"
          resizeMode="contain"
        />
        <Heading size="3xl" className="leading-tight text-foreground mb-1">
          {isSignUp ? "Create account" : "Welcome back"}
        </Heading>
        <Text className="text-muted-foreground text-base mb-5">
          {isSignUp
            ? "Track your money , powered by Ai"
            : "Login to your account"}
        </Text>

        {isSignUp && (
          <View className="flex-row gap-4">
            <View className="flex-1">
              <CustomInput
                control={control}
                name={"firstName" as Path<V>}
                placeholder="First name"
              />
            </View>
            <View className="flex-1">
              <CustomInput
                control={control}
                name={"lastName" as Path<V>}
                placeholder="Last name"
              />
            </View>
          </View>
        )}

        <CustomInput
          control={control}
          name={"email" as Path<V>}
          placeholder="Email Address"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
        />
        <CustomInput
          control={control}
          name={"password" as Path<V>}
          placeholder="Enter your Password"
          secureTextEntry
          autoComplete={isSignUp ? "new-password" : "current-password"}
        />
        <CustomBotton
          text={isSignUp ? "Create Account" : "Log In"}
          className="mt-5"
          onPress={press}
          isPending={isPending}
          disabled={isPending}
        />
        <View className="flex-row justify-center mt-4">
          <Text className="text-muted-foreground">
            {isSignUp
              ? "Already have an account?"
              : "Don't have an account yet?"}{" "}
          </Text>
          <Link href={isSignUp ? "/(auth)/sign-in" : "/(auth)/sign-up"} asChild>
            <TouchableOpacity>
              <Text className="text-[#0043d3] font-bold tracking-widest">
                {isSignUp ? "Sign In" : "Create One"}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CustomFormPage;
