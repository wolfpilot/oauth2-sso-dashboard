"use client"

import { useActionState } from "react"

// Types
import type {
  RegisterSchemaError,
  ZodErrorFields,
} from "@schemas/register.schemas"

// Utils
import { signup as signupAction } from "@utils/actions"

// Components
import { Button } from "@components/buttons"
import { ZodError, type ZodIssue } from "zod"

// Setup
const INITIAL_STATE = {
  errors: {} as RegisterSchemaError,
}

// TODO: move to utils
export const isZodError = (
  val: RegisterSchemaError
): val is RegisterSchemaError =>
  val.hasOwnProperty("fieldErrors") && val.hasOwnProperty("formErrors")
// && val.formErrors

const parseFieldErrors = (errors: ZodErrorFields[]) => {
  return errors.map((item) => item.message).join(", ")
}

const parseErrors = (errors: Error | RegisterSchemaError) => {
  // !: Switch

  if (errors instanceof Error) {
    console.log("User thrown error", errors)

    return {
      fieldErrors: {},
      formErrors: [errors.message],
    }
  } else if (isZodError(errors)) {
    console.log("Zod error", errors)

    return
  } else {
    console.log("Unhandled error", errors)
  }
}

// !: Move all input code to <Input /> and also pass & parse specific field errors locally
// !: Only display and parse FormErrors here
// !: Always return an object of the shape errors: field ; form

// const ErrorMessages = ({ errors }: { errors: string[] }) => {
//   if (errors.length === 0) return null

//   const text = errors.join(", ")

//   return <div className="text-red-600 peer">{text}</div>
// }

// const findErrors = (fieldName: string, errors: ZodIssue[]) => {
//   return errors
//     .filter((item) => {
//       return item.path.includes(fieldName)
//     })
//     .map((item) => item.message)
// }

const SignupForm = () => {
  const [formState, formAction, pending] = useActionState(
    signupAction,
    INITIAL_STATE
  )

  console.log("SignupForm formState", formState)

  // TODO: validate on FE before submitting?

  // const nameErrors = findErrors("name", formState.errors)
  // const emailErrors = findErrors("email", formState.errors)
  // const passwordErrors = findErrors("password", formState.errors)

  // !: Need to parse/display on FE
  // if (formState.errors) {
  //   //   const errors = parseErrors<RegisterSchema>(formState.error)

  //   console.error("SignupForm formState.error", formState.errors)
  // }

  const { name, email, password } = formState?.data || {}

  // if (formState.errors && typeof formState.errors !== "string") {
  //   console.log(
  //     "parseFieldErrors",
  //     parseFieldErrors(formState.errors.fieldErrors?.password)
  //   )
  // }

  console.log("SIGNUP FORM formState.errors", formState.errors)

  if (formState.errors) {
    parseErrors(formState.errors)
  }

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">
          <span>Name</span>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Smith"
            defaultValue={name}
            // required
          />
        </label>
        {/* <ErrorMessages errors={nameErrors} /> */}
      </div>

      <div>
        <label htmlFor="email">
          <span>Email</span>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="jsmith@example.com"
            defaultValue={email}
            // required
          />
        </label>
        {/* <ErrorMessages errors={emailErrors} /> */}
      </div>

      <div>
        <label htmlFor="password">
          <span>Password</span>
          <input
            type="text"
            id="password"
            name="password"
            placeholder="********"
            defaultValue={password}
            // required
            // autoComplete="off"
          />
        </label>
        {/* <ErrorMessages errors={passwordErrors} /> */}
      </div>

      {/* {formState.errors.} */}

      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Processing..." : "Sign up"}
      </Button>
    </form>
  )
}

export default SignupForm
