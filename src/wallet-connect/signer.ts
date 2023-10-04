/// <reference types="@vechain/connex-types" />
import { SignClient } from "@walletconnect/sign-client/dist/types/client"
import { SessionTypes } from "@walletconnect/types"
import { EngineTypes } from "@walletconnect/types/dist/types/sign-client/engine"
import { WalletConnectModal } from "@walletconnect/modal"
import { getSdkError } from "@walletconnect/utils"
import { getNetworkIdentifier } from "./utils"
import { DEFAULT_EVENTS, DEFAULT_METHODS } from "./constants"
import { Client } from "./client"

export type Signer = Connex.Signer & {
  disconnect: () => Promise<void>
}

type SessionAccount = {
  networkIdentifier: string
  address: string
  topic: string
}

/**
 * Creates a new WalletConnect Signer - It can be used to construct a new {@link Connex.Vendor} instance
 * @param genesisId - The genesis ID of the VeChain network you want to connect to
 * @param wcClient - A function to get the initialized WalletConnect SignClient
 * @param web3Modal - A WalletConnectModal instance
 * @param onDisconnected - A callback that will be called when the session is disconnected
 */
export const newWcSigner = (
  genesisId: string,
  wcClient: Client,
  web3Modal: WalletConnectModal,
  onDisconnected: () => void
): Signer => {
  const networkIdentifier = getNetworkIdentifier(genesisId)
  let session: SessionTypes.Struct | undefined

  wcClient.get().then((clientInstance) => {
    listenToEvents(clientInstance)
    restoreSession(clientInstance)
  })

  const signTx = async (
    message: Connex.Vendor.TxMessage,
    options: Connex.Signer.TxOptions
  ): Promise<Connex.Vendor.TxResponse> => {
    const sessionTopic = await getSessionTopic(options.signer)

    const signClient = await wcClient.get()

    return signClient.request({
      topic: sessionTopic,
      chainId: networkIdentifier,
      request: {
        method: DEFAULT_METHODS.REQUEST_TRANSACTION,
        params: [{ message, options }],
      },
    })
  }

  const signCert = async (
    message: Connex.Vendor.CertMessage,
    options: Connex.Signer.CertOptions
  ): Promise<Connex.Vendor.CertResponse> => {
    const sessionTopic = await getSessionTopic(options.signer)

    const signClient = await wcClient.get()

    return signClient.request({
      topic: sessionTopic,
      chainId: networkIdentifier,
      request: {
        method: DEFAULT_METHODS.SIGN_CERTIFICATE,
        params: [{ message, options }],
      },
    })
  }

  const disconnect = async (): Promise<void> => {
    if (!session) return

    const topic = session.topic
    session = undefined

    const signClient = await wcClient.get()

    try {
      await signClient.disconnect({
        topic: topic,
        reason: getSdkError("USER_DISCONNECTED"),
      })
    } catch (error) {
      console.warn("SignClient.disconnect failed:", error)
    }
  }

  /**
   * Validates the requested account and network against a request
   * @param requestedAddress - The optional requested account address
   */
  const validateSession = (
    requestedAddress?: string
  ): SessionAccount | undefined => {
    if (!session) return

    const firstAccount = session.namespaces.vechain.accounts[0]

    const address = firstAccount.split(":")[2]
    const networkIdentifier = firstAccount.split(":")[1]

    // Return undefined if the network identifier doesn't match
    if (networkIdentifier !== genesisId.slice(-32)) return

    // Return undefined if the address doesn't match
    if (
      requestedAddress &&
      requestedAddress.toLowerCase() !== address.toLowerCase()
    )
      return

    return {
      address,
      networkIdentifier,
      topic: session.topic,
    }
  }

  const getSessionTopic = async (
    requestedAccount?: string
  ): Promise<string> => {
    const validation = validateSession(requestedAccount)

    if (validation) return validation.topic

    const newSession = await connect()

    return newSession.topic
  }

  const connect = async (): Promise<SessionTypes.Struct> => {
    const signClient = await wcClient.get()

    try {
      const requiredNamespaces: EngineTypes.ConnectParams["requiredNamespaces"] =
        {
          vechain: {
            methods: Object.values(DEFAULT_METHODS),
            chains: [networkIdentifier],
            events: Object.values(DEFAULT_EVENTS),
          },
        }

      const { uri, approval } = await signClient.connect({
        requiredNamespaces,
      })

      if (uri) {
        // Create a flat array of all requested chains across namespaces.
        const chains = Object.values(requiredNamespaces)
          .map((namespace) => namespace.chains)
          .flat() as string[]

        await web3Modal.openModal({ uri, chains })
      }

      return await new Promise((resolve, reject) => {
        web3Modal.subscribeModal((ev: { open: boolean }) => {
          console.log(ev.open ? "Modal opened" : "Modal closed")
          if (!ev.open) {
            reject(new Error("User closed modal"))
          }
        })

        approval()
          .then((newSession) => {
            session = newSession
            resolve(newSession)
          })
          .catch(reject)
      })
    } catch (e) {
      console.warn("WalletConnect connect failed:", e)
      throw e
    } finally {
      web3Modal.closeModal()
    }
  }

  const listenToEvents = (_client: SignClient) => {
    _client.on("session_ping", (args) => {
      console.log("EVENT", "session_ping", args)
    })

    _client.on("session_event", (args) => {
      console.log("EVENT", "session_event", args)
    })

    _client.on("session_update", ({ topic, params }) => {
      console.log("EVENT", "session_update", { topic, params })
      if (!_client) return
      const { namespaces } = params
      const _session = _client.session.get(topic)
      session = { ..._session, namespaces }
    })

    _client.on("session_delete", () => {
      console.log("EVENT", "session_delete")
      onDisconnected()
      disconnect()
    })
  }

  const restoreSession = (_client: SignClient) => {
    if (typeof session !== "undefined") return

    const sessionKeys = _client.session.keys

    for (const key of sessionKeys) {
      const _session = _client.session.get(key)
      const accounts = _session.namespaces.vechain.accounts

      for (const acc of accounts) {
        if (acc.split(":")[1] === genesisId.slice(-32)) {
          session = _session
        }
      }
    }
  }

  return {
    signTx,
    signCert,
    disconnect,
  }
}
