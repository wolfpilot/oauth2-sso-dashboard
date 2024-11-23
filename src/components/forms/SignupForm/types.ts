import { FieldError, UseFormRegister } from "react-hook-form"

// Types
import type {
  RegisterSchema,
  RegisterSchemaError,
} from "@schemas/register.schemas"

export type FormData = RegisterSchema

export type FormFieldProps = {
  type: string
  placeholder: string
  name: ValidFieldNames
  register: UseFormRegister<FormData>
  error: FieldError | undefined
  valueAsNumber?: boolean
}

export type ValidFieldNames = "name" | "email" | "password"

export interface FormState {
  errors: RegisterSchemaError
}
