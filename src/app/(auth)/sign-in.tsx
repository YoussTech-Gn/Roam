import CustomFormPage from "@/src/components/CustomFormPage";
import { signInFields, signInSchema } from "@/src/utils/schemas/schema";
import { errorSignInHandler, navigateAfterAuth } from "@/src/utils/utils";
import { useAuth, useSignIn } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";

const SigInPage = () => {
  const { signIn, fetchStatus, errors } = useSignIn();
  const { isSignedIn } = useAuth();
  const { control, setError, handleSubmit } = useForm<signInFields>({
    resolver: zodResolver(signInSchema),
  });
  const onSignInPress = async ({ email, password }: signInFields) => {
    if (isSignedIn) return;
    console.info("Sign in button pressed");

    try {
      const { error: errorSignIn } = await signIn.password({
        password: password,
        emailAddress: email.toLowerCase(),
      });
      if (errorSignIn) {
        errorSignInHandler(errorSignIn, setError);
        return;
      }
      switch (signIn.status) {
        case "complete":
          await signIn.finalize({
            navigate: navigateAfterAuth,
          });
          break;

        case "needs_second_factor":
          await signIn.mfa.sendPhoneCode();
          router.push({
            pathname: "/(auth)/verifyEmail",
            params: {
              email: email,
              flow: "sign-in",
            },
          });
          break;

        case "needs_client_trust": {
          const emailCodeFactor = signIn.supportedSecondFactors?.find(
            (factor) => factor.strategy === "email_code",
          );
          if (!emailCodeFactor) {
            console.warn(
              "no email_code factor available for needs_client_trust",
            );
            break;
          }
          const { error: mfaError } = await signIn.mfa.sendEmailCode();
          if (mfaError) {
            if (mfaError.code === "factor_not_found") {
              setError("email", {
                type: "custom",
                message: "this email not found try sign up",
              });
            } else if (mfaError.code === "rate_limit_exceeded") {
              setError("email", {
                type: "custom",
                message: "too many attempts please try again later",
              });
            } else {
              setError("email", { type: "custom", message: mfaError.message });
            }
            break;
          }
          router.push({
            pathname: "/(auth)/verifyEmail",
            params: {
              email: email,
              flow: "sign-in",
            },
          });
          break;
        }

        case "needs_first_factor":
          console.warn("needs_first_factor");
          break;

        default:
          console.error("unknown sign in status", signIn.status);
          break;
      }
    } catch (err: any) {
      console.error("Unexpected sign-in error:", err);
      setError("email", {
        type: "custom",
        message: err?.message || "Sign in failed. Please try again.",
      });
    }
  };
  const isPending = fetchStatus === "fetching";
  return (
    <CustomFormPage<signInFields>
      page="signIn"
      press={handleSubmit(onSignInPress)}
      control={control}
      isPending={isPending}
    />
  );
};

export default SigInPage;
