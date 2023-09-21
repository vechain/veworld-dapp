import SignClient from "@walletconnect/sign-client"
import { SignClientTypes } from "@walletconnect/types"

export const newWcClient = (
  projectId: string,
  relayUrl: string,
  metadata: SignClientTypes.Options["metadata"]
) =>
  SignClient.init({
    projectId,
    metadata,
    relayUrl,
    logger: process.env.NODE_ENV === "development" ? "debug" : "",
  })
