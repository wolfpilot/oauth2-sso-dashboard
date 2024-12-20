import NextAuth, { type User, type NextAuthConfig } from "next-auth"
import { encode as defaultEncode } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { KyselyAdapter } from "@auth/kysely-adapter"
import bcrypt from "bcryptjs"
import { v4 as uuid } from "uuid"

// Constants
import { clientRoutes } from "@constants/clientRoutes.constants"

// Lib
import { db } from "@lib/database.lib"

// Setup
/**
 * Ignore issues as DB types generated by kysely-codegen are wrong.
 *
 * There are many threads already open on various issues (mismatched data types,
 * interfaces instead of types, etc.) that it's hard to pin-point a specific resolution.
 *
 * For now, the fix is a combination of manual typing and type-casting.
 *
 * @see https://github.com/nextauthjs/next-auth/issues/10441#issuecomment-2215188319
 */
// @ts-expect-error See above
const adapter = KyselyAdapter(db)

const config: NextAuthConfig = {
  adapter,
  session: {
    strategy: "database",
  },
  providers: [
    GitHub,
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as Partial<
          Record<"email" | "password", string>
        >

        if (!email || !password) return null

        const userRecords = await db
          .selectFrom("User")
          .selectAll()
          .where("email", "=", email)
          .executeTakeFirstOrThrow()

        if (!userRecords) {
          return null
        }

        const isPasswordMatch = await bcrypt.compare(
          password,
          userRecords.password_hash
        )

        if (!isPasswordMatch) {
          return null
        }

        return userRecords satisfies User
      },
    }),
  ],
  callbacks: {
    /**
     * Add an extra .credentials property to identify the current login method when issuing JWTs
     */
    jwt: async ({ token, account }) => {
      if (account?.provider === "credentials") {
        token.credentials = true
      }

      return token
    },
  },
  jwt: {
    encode: async (params) => {
      /**
       * Create a new session manually.
       *
       * This fixes a bug with Auth.js where using the "database" strategy leads to the credentials
       * login method not being handled properly by the library.
       *
       * @see https://www.youtube.com/watch?v=rZ-WNsxu17s
       */
      if (params.token?.credentials) {
        const sessionToken = uuid()

        if (!params.token.sub) {
          throw new Error("Could not find user ID in token.")
        }

        const newSession = await adapter.createSession?.({
          sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        })

        if (!newSession) {
          throw new Error("Failed to create new session.")
        }

        return sessionToken
      }

      // Login with SSO
      return defaultEncode(params)
    },
  },
  pages: {
    newUser: clientRoutes.signUp.url,
    signIn: clientRoutes.signIn.url,
    signOut: clientRoutes.dashboard.url,
  },
  // debug: true,
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)
