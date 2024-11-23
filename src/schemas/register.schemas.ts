import * as z from "zod"

export const registerSchema = z.object({
  name: z
    .string({
      required_error: "Name is required.",
    })
    .min(2, {
      message: "Name must be at least 2 characters long.",
    }),
  email: z
    .string({
      required_error: "Email is required.",
    })
    .email({ message: "Invalid email address." }),
  password: z
    .string({
      required_error: "Password is required.",
    })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-zA-Z]/, {
      message: "Password must contain at least one letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .trim(),
})

export interface ZodErrorFields {
  message: string
  code: string
}

export type RegisterSchema = z.infer<typeof registerSchema>
export type RegisterSchemaError = z.inferFlattenedErrors<
  typeof registerSchema,
  ZodErrorFields
>
