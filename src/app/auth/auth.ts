import { z } from "zod";
export const SigninFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export type SigninFormData = z.infer<typeof SigninFormSchema>;
