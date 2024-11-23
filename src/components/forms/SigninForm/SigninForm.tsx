"use client"

// Utils
import { signinWithProvider } from "@utils/actions"

// Components
import { Button } from "@components/buttons"

const SigninForm = () => {
  return (
    <form action={async () => signinWithProvider("github")}>
      <Button type="submit" variant="secondary">
        Sign in
      </Button>
    </form>
  )
}

export default SigninForm
