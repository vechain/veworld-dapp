import { SessionTypes } from "@walletconnect/types"

export const accountFromSession = (session: SessionTypes.Struct) => {
  return session.namespaces.vechain.accounts[0].split(":")[2]
}

export const getNetworkIdentifier = (genesisId: string) =>
  `vechain:${genesisId.slice(-32)}`
