import { Heading } from "@/components/ui/heading";
import CustomBotton from "@/src/components/CustomButton";
import CustomInput from "@/src/components/InputField";
import { verifyFields, verifySchema } from "@/src/utils/schemas/schema";
import { navigateAfterAuth } from "@/src/utils/utils";
import { useSignIn, useSignUp } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";

const VerifyEmail = () => {
  const { control, setError, handleSubmit } = useForm<verifyFields>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });
  const { flow, email } = useLocalSearchParams<{
    flow: "sign-in" | "sign-up";
    email: string;
  }>();

  const { signIn, fetchStatus } = useSignIn();
  const { signUp, fetchStatus: signUpStatus } = useSignUp();

  const onVerifycode = async ({ code }: verifyFields) => {
    if (flow !== "sign-up" && flow !== "sign-in") {
      setError("code", {
        type: "custom",
        message: "Something went wrong, please start again",
      });
      return;
    }

    try {
      const { error } =
        flow === "sign-up"
          ? await signUp.verifications.verifyEmailCode({ code })
          : await signIn.mfa.verifyEmailCode({ code });

      if (error) {
        const e: any = error;
        const first = e.errors?.[0];
        const errCode = first?.code ?? e.code;
        const message = first?.longMessage ?? first?.message ?? e.message;

        switch (errCode) {
          case "form_param_format_invalid":
            setError("code", {
              type: "custom",
              message: "Invalid code format",
            });
            break;
          case "form_code_incorrect":
            setError("code", { type: "custom", message: "Incorrect code" });
            break;
          case "form_code_expired":
            setError("code", { type: "custom", message: "Code has expired" });
            break;
          default:
            setError("code", {
              type: "custom",
              message: message || "Invalid code",
            });
            break;
        }
        return;
      }

      const target = flow === "sign-up" ? signUp : signIn;
      if (target.status !== "complete") {
        setError("code", {
          type: "custom",
          message: "More verification is needed to finish",
        });
        return;
      }
      await target.finalize({ navigate: navigateAfterAuth });
    } catch (e: any) {
      console.error(`Unexpected ${flow} error`);
      setError("code", {
        type: "custom",
        message: e?.message || "Verification failed. Please try again.",
      });
    }
  };

  const isPending = fetchStatus === "fetching" || signUpStatus === "fetching";

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
          Verify Your Email
        </Heading>
        <Text className="text-muted-foreground text-base mb-5">
          We've sent a verification code to{" "}
          <Text className="font-bold text-foreground">{email}</Text>
        </Text>
        <CustomInput
          control={control}
          name="code"
          placeholder="Verification code"
          keyboardType="number-pad"
          maxLength={6}
          autoComplete="one-time-code"
        />
        <CustomBotton
          text="Verify"
          className="mt-5"
          isPending={isPending}
          disabled={isPending}
          onPress={handleSubmit(onVerifycode)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default VerifyEmail;
