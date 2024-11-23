"use server"

import type { OAuthProviderType } from "next-auth/providers"

// Lib
import { signIn } from "@lib/auth.lib"

export const signinWithProvider = async (provider: OAuthProviderType) => {
  try {
    await signIn(provider, {
      redirect: true,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    throw error
  }
}
