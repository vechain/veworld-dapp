if (!process.env.REACT_APP_PUBLIC_PROJECT_ID)
  throw new Error("`REACT_APP_PUBLIC_PROJECT_ID` env variable is missing.")

export const DEFAULT_PROJECT_ID = process.env.REACT_APP_PUBLIC_PROJECT_ID
// If undefined will use the Wallet Connect default
export const DEFAULT_RELAY_URL = process.env.REACT_APP_RELAY_URL

export const DEFAULT_LOGGER = "debug"

export const DEFAULT_APP_METADATA = {
  name: "Official VeWorld Demo Dapp",
  description:
    "You can use this dapp to familiarize and know more about creation on VeChain",
  url: "https://your_app_url.com/",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
}

export const SUPPORTED_CHAINS = ["vechain:main", "vechain:test"]

export enum DEFAULT_METHODS {
  REQUEST_TRANSACTION = "request_transaction",
  IDENTIFY = "identify",
}

export enum DEFAULT_EVENTS {
  CHAIN_CHANGED = "chainChanged",
  ACCOUNTS_CHANGED = "accountsChanged",
}
