import { SessionTypes } from "@walletconnect/types"

/**
 * Returns the account address from a WalletConnect session
 * @param session - The WalletConnect session
 */
export const accountFromSession = (session: SessionTypes.Struct) => {
  return session.namespaces.vechain.accounts[0].split(":")[2]
}

/**
 * Returns the network identifier from a WalletConnect session
 * @param genesisId - The genesis ID of the VeChain network you want to connect to
 */
export const getNetworkIdentifier = (genesisId: string) =>
  `vechain:${genesisId.slice(-32)}`
