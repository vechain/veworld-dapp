import SignClient from "@walletconnect/sign-client"
import { SignClientTypes } from "@walletconnect/types"

export type Client = {
  get: () => Promise<SignClient>
}

/**
 * Creates a new WalletConnect SignClient
 * @param projectId - Your WalletConnect project ID
 * @param relayUrl - The URL of your WalletConnect relay server
 * @param metadata - The metadata of your WalletConnect dApp
 */
export const newWcClient = (
  projectId: string,
  relayUrl: string,
  metadata: SignClientTypes.Options["metadata"],
  logger: SignClientTypes.Options["logger"]
) => {
  const _signClient = SignClient.init({
    projectId,
    metadata,
    relayUrl,
    logger,
  })

  return {
    get: async () => {
      try {
        return await _signClient
      } catch (e) {
        console.error(e)
        throw new Error(`Failed to initialise the wallet connect sign client`)
      }
    },
  }
}
