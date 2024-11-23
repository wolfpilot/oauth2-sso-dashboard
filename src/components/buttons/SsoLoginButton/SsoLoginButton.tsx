"use client"

import Image from "next/image"

// Types
import { ProviderNames } from "@ts/auth.types"
import { Props } from "./types"

// Utils
import { signinWithProvider } from "@utils/actions/auth/signin.actions"
import { isValidProvider } from "@utils/typeguards/auth.typeguards"

// Styles
import styles from "./SsoLoginButton.module.css"

// Components
import { Button } from "@components/buttons"

const SsoLoginButton = ({ provider }: Props) => {
  if (!isValidProvider(provider)) {
    return null
  }

  const handleOnClick = () => {
    signinWithProvider(provider)
  }

  return (
    <Button
      className={styles.wrapper}
      type="button"
      variant="secondary"
      onClick={handleOnClick}
    >
      <Image
        className={styles.image}
        src={`/images/svg/logo-${provider}.svg`}
        width={28}
        height={28}
        alt={`Logo of ${ProviderNames[provider]}`}
      />
      <span>{`Continue with ${ProviderNames[provider]}`}</span>
    </Button>
  )
}

export default SsoLoginButton
