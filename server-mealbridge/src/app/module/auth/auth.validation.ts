import { z } from "zod";

const register = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
    role: z.enum(["restaurant", "ngo"], {
      invalid_type_error: "Role must be restaurant or ngo",
    }),
    address: z.string().optional(),
    area: z.string().min(1, "Area is required"),
  }),
});

const login = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const authValidation = {
  register,
  login,
};
