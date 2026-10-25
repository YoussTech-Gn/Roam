import CustomFormPage from "@/src/components/CustomFormPage";
import { signUpFields, signUpSchema } from "@/src/utils/schemas/schema";
import { isKnownError, useAuth, useSignUp } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect, useRouter } from "expo-router";
import { useForm } from "react-hook-form";

const SignUpPage = () => {
  const { control, setError, handleSubmit } = useForm<signUpFields>({
    resolver: zodResolver(signUpSchema),
  });
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signUp, fetchStatus } = useSignUp();

  const onSignUpPress = async (data: signUpFields) => {
    try {
      const { error } = await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      if (error) {
        switch (error.code) {
          case "form_param_format_invalid":
            setError("email", {
              type: "custom",
              message: "Invalid Email format",
            });
            break;
          case "form_password_too_weak":
            setError("password", {
              type: "custom",
              message: error.message,
            });
            break;
          case "form_identifier_exists":
            setError("email", {
              type: "custom",
              message: "This email is already in use",
            });
            break;
          case "form_password_pwned":
            setError("password", {
              type: "custom",
              message:
                "This password has been compromised, please use another one",
            });
            break;
          default:
            console.log("Clerk code:", error.code);
            // setError("email", { type: "custom", message: error.message });
            setError("password", { type: "custom", message: error.message });
            break;
        }
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setError("email", {
          type: "custom",
          message:
            sendError.code === "rate_limit_exceeded"
              ? "Too many attempts, please try again later"
              : (sendError.message ?? "Failed to send verification code"),
        });
        return;
      }

      router.push({
        pathname: "/(auth)/verifyEmail",
        params: { email: data.email, flow: "sign-up" },
      });
    } catch (e) {
      console.error("Unexpected sign-up error");
      setError("email", {
        type: "custom",
        message: isKnownError(e)
          ? (e.message ?? "Sign up failed")
          : "Sign up failed. Please try again.",
      });
    }
  };

  if (isSignedIn) return <Redirect href="/(secured)/(tabs)" />;

  return (
    <CustomFormPage<signUpFields>
      isPending={fetchStatus === "fetching"}
      page="signUp"
      press={handleSubmit(onSignUpPress)}
      control={control}
    />
  );
};

export default SignUpPage;
