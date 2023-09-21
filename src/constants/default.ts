import { CoreTypes } from "@walletconnect/types/dist/types/core/core"

if (!process.env.REACT_APP_PUBLIC_PROJECT_ID)
  throw new Error("`REACT_APP_PUBLIC_PROJECT_ID` env variable is missing.")

export const WC_PROJECT_ID = process.env.REACT_APP_PUBLIC_PROJECT_ID

console.log("DEFAULT_PROJECT_ID", WC_PROJECT_ID)

// If undefined will use the Wallet Connect default
export const WC_RELAY_URL =
  process.env.REACT_APP_RELAY_URL || "wss://relay.walletconnect.com"

export const WC_APP_METADATA: CoreTypes.Metadata = {
  name: "Official VeWorld Demo dApp",
  description:
    "You can use this dapp to familiarize and know more about creation on VeChain",
  url: window.location.origin,
  icons: ["https://i.ibb.co/zb85hsL/vechain-vet-logo512.png"],
}
