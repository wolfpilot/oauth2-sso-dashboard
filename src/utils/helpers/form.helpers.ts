import type { ZodError } from "zod"

// Types
import type { RegisterSchemaError } from "@schemas/register.schemas"

export const parseZodErrors = <T>(error: ZodError<T>): RegisterSchemaError =>
  error.flatten((issue) => ({
    message: issue.message,
    code: issue.code,
  }))
