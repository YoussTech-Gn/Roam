import { Href, router } from "expo-router";
import { UseFormSetError } from "react-hook-form";
import { signInFields, signUpFields } from "./schemas/schema";

export const errorSignInHandler = (
  errorSignIn: any,
  setError: UseFormSetError<signInFields>,
) => {
  switch (errorSignIn.code) {
    case "form_param_format_invalid":
      setError("email", {
        type: "custom",
        message: "Invalid Email format",
      });
      break;
    case "form_param_not_set":
      setError("password", {
        type: "custom",
        message: "Password is required",
      });
      break;
    case "form_password_not_set":
      setError("password", {
        type: "custom",
        message: "Password is required",
      });
      break;
    case "form_password_too_weak":
      setError("password", {
        type: "custom",
        message: errorSignIn.message,
      });
      break;
    case "form_identifier_not_found":
      setError("email", {
        type: "custom",
        message: "Account not found try sign up",
      });
      break;
    default:
      setError("email", { type: "custom", message: errorSignIn.message });
      setError("password", { type: "custom", message: errorSignIn.message });
      break;
  }
};
export const errorSignUPHandler = (
  errorSignUp: any,
  setError: UseFormSetError<signUpFields>,
) => {
  switch (errorSignUp.code) {
    case "form_param_format_invalid":
      setError("email", {
        type: "custom",
        message: "Invalid Email format",
      });
      break;
    case "form_password_too_weak":
      setError("password", {
        type: "custom",
        message: errorSignUp.message,
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
        message: "This password has been compromised, please use another one",
      });
      break;
    default:
      setError("email", { type: "custom", message: errorSignUp.message });
      setError("password", { type: "custom", message: errorSignUp.message });
      break;
  }
};

export const navigateAfterAuth = ({ decorateUrl, session }: any) => {
  if (session?.currentTask) return;
  router.push(decorateUrl("/") as Href);
};
