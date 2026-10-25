// import zod, { email } from 'zod'
import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email("Enter a valid email").trim().toLowerCase(),
  firstName: z.string().trim().min(0, "First name is required"),
  lastName: z.string().trim().min(0, "Last name is required"),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
  //   confirmPassword : z.p
});
export const signInSchema = z.object({
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
});

export type signInFields = z.infer<typeof signInSchema>;
export type signUpFields = z.infer<typeof signUpSchema>;

export const verifySchema = z.object({
  code: z.string().trim().length(6, "The code is 6 digits"),
});

export type verifyFields = z.infer<typeof verifySchema>;
