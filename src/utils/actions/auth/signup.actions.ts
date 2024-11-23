"use server"

import bcrypt from "bcryptjs"

// Types
import type {
  RegisterSchema,
  RegisterSchemaError,
} from "@schemas/register.schemas"

// Schemas
import { registerSchema } from "@schemas/register.schemas"

// Lib
import { db } from "@lib/database.lib"

// Utils
import { parseZodErrors } from "@utils/helpers/form.helpers"

export interface FormState {
  data?: RegisterSchema
  errors?: Error | RegisterSchemaError
}

export const signup = async (_formState: FormState, formData: FormData) => {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const validated = registerSchema.safeParse(data)

  if (!validated.success) {
    return {
      errors: parseZodErrors(validated.error),
    }
  }

  try {
    const userRecords = await db
      .selectFrom("User")
      .select("name")
      .where("email", "=", data.email)
      .execute()

    console.log("SIGNUP ACTION userRecords", userRecords)

    if (userRecords.length) {
      return {
        // errors: "Email address is already registered.",
        errors: new Error("Email address is already registered."),
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    console.log("SIGNUP ACTION hashedPassword", hashedPassword)

    const insertUserQuery = await db
      .insertInto("User")
      .values({
        name: data.name,
        email: data.email,
        password_hash: hashedPassword,
      })
      .returning("id")
      .executeTakeFirstOrThrow()

    return {
      data: {
        ...data,
        id: insertUserQuery.id,
      },
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }

    return {
      // errors: "Something went wrong",
      errors: new Error("Something went wrong."),
    }
  }
}
