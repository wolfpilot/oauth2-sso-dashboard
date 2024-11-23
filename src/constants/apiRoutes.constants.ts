import type { Routes } from "@ts/routes.types"

// Setup
export const apiRoutes: Routes = {
  auth: {
    label: "Authentication",
    url: "/api/auth",
  },
  // signUp: {
  //   label: "Sign Up",
  //   url: "/api/auth/signup",
  // },
  signIn: {
    label: "Sign In",
    url: "/api/auth/signin",
  },
}
