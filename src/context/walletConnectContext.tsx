import { SignClient as Client } from "@walletconnect/sign-client/dist/types/client"
import { SessionTypes } from "@walletconnect/types"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { SignClient } from "@walletconnect/sign-client"
import { Network, WalletSource } from "../model/enums"
import { getSdkError } from "@walletconnect/utils"
import { Certificate } from "thor-devkit"
import {
  DEFAULT_APP_METADATA,
  DEFAULT_EVENTS,
  DEFAULT_LOGGER,
  DEFAULT_METHODS,
  DEFAULT_PROJECT_ID,
  DEFAULT_RELAY_URL,
  SUPPORTED_CHAINS,
} from "../constants"
import ConnexService from "../service/ConnexService"
import { ActionType, useWallet } from "./walletContext"
import { WalletConnectModal } from "@walletconnect/modal"
import { EngineTypes } from "@walletconnect/types/dist/types/sign-client/engine"
import { isMobile } from "../utils/MobileUtils"
import { fromChainId, getChainId } from "../utils/ChainUtil"

/**
 * Types
 */
interface IContext {
  client: Client | undefined
  session: SessionTypes.Struct | undefined
  connect: (
    network: Network,
    onSuccess: (session: SessionTypes.Struct) => Promise<void>,
    onError?: (err: unknown) => void
  ) => Promise<void>
  disconnect: () => Promise<void>
  isInitializing: boolean
  identifyUser: (
    network: Network,
    session: SessionTypes.Struct
  ) => Promise<Certificate>
}

/**
 * Context
 */
export const WalletConnectContext = createContext<IContext>({} as IContext)

/**
 * Web3Modal Config
 */

const web3Modal = new WalletConnectModal({
  projectId: DEFAULT_PROJECT_ID,
  explorerRecommendedWalletIds: "NONE",
  mobileWallets: [
    {
      name: "VeWorld",
      id: "veworld-mobile",
      links: {
        native: "wc://org.vechain.veworld.app/",
        universal: "https://veworld.net",
      },
    },
  ],
  themeVariables: {
    "--wcm-z-index": "99999999",
  },
  walletImages: {
    "veworld-mobile": process.env.PUBLIC_URL + "/images/logo/veWorld.png",
  },
})

interface IWalletConnectProvider {
  children: React.ReactNode
}

export const WalletConnectProvider = ({ children }: IWalletConnectProvider) => {
  const [client, setClient] = useState<Client>()
  const [session, setSession] = useState<SessionTypes.Struct>()

  const [isInitializing, setIsInitializing] = useState(false)
  const { dispatch } = useWallet()

  const reset = () => {
    console.log("Resetting WalletConnect state")
    setSession(undefined)

    ConnexService.clear()
    dispatch({ type: ActionType.CLEAR })
  }

  const connect = useCallback(
    async (
      network: Network,
      onSuccess: (session: SessionTypes.Struct) => Promise<void>,
      onError?: (err: unknown) => void
    ) => {
      if (typeof client === "undefined") {
        throw new Error("WalletConnect is not initialized")
      }

      let session: SessionTypes.Struct | undefined
      try {
        const requiredNamespaces: EngineTypes.ConnectParams["requiredNamespaces"] =
          {
            vechain: {
              methods: Object.values(DEFAULT_METHODS),
              chains: SUPPORTED_CHAINS,
              events: Object.values(DEFAULT_EVENTS),
            },
          }

        const { uri, approval } = await client.connect({
          requiredNamespaces,
        })

        if (uri) {
          // Create a flat array of all requested chains across namespaces.
          const chains = Object.values(requiredNamespaces)
            .map((namespace) => namespace.chains)
            .flat() as string[]

          await web3Modal.openModal({ uri, chains })
        }

        //TODO: if user closes modal before approving on mobile state is not resetted

        session = await approval()
        console.log("Established session:", session)

        setSession(session)

        web3Modal.closeModal()

        await onSuccess(session)
      } catch (e) {
        web3Modal.closeModal()
        onError?.(e)

        throw e
      }
    },
    [client]
  )

  const identifyUser = useCallback(
    async (network: Network, session: SessionTypes.Struct) => {
      if (typeof client === "undefined") {
        throw new Error("WalletConnect is not initialized")
      }
      if (typeof session === "undefined") {
        throw new Error("Session is not connected")
      }

      try {
        const message: Connex.Vendor.CertMessage = {
          purpose: "identification",
          payload: {
            type: "text",
            content: "Sign a certificate to prove your identity",
          },
        }

        const options: Connex.Driver.CertOptions = {}

        const resPromise: Promise<Connex.Vendor.CertResponse> = client.request({
          topic: session.topic,
          chainId: getChainId(network),
          request: {
            method: DEFAULT_METHODS.SIGN_CERTIFICATE,
            params: [{ message, options }],
          },
        })

        if (isMobile() && !document.hidden) window.open("wc://")

        const result = await resPromise

        const cert: Certificate = {
          purpose: message.purpose,
          payload: message.payload,
          domain: result.annex.domain,
          timestamp: result.annex.timestamp,
          signer: result.annex.signer,
          signature: result.signature,
        }

        console.log("Signed cert", cert)
        Certificate.verify(cert)
        console.log("Cert verified")

        return cert
      } catch (error) {
        console.error("SignClient.identifyUser failed:", error)

        // Disconnect from session if user rejects identify signature request
        await client.disconnect({
          topic: session.topic,
          reason: getSdkError("USER_DISCONNECTED"),
        })

        throw error
      }
    },
    [client, session]
  )

  const disconnect = useCallback(async () => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect client is not initialized")
    }
    if (typeof session === "undefined") {
      throw new Error("Session is not connected")
    }

    try {
      await client.disconnect({
        topic: session.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      })
    } catch (error) {
      console.error("SignClient.disconnect failed:", error)
    } finally {
      // Reset app state after disconnect.
      reset()
    }
  }, [client, session])

  const subscribeToEvents = useCallback(async (_client: Client) => {
    if (typeof _client === "undefined") {
      throw new Error("WalletConnect is not initialized")
    }

    _client.on("session_ping", (args) => {
      console.log("EVENT", "session_ping", args)
    })

    _client.on("session_event", (args) => {
      console.log("EVENT", "session_event", args)
    })

    _client.on("session_update", ({ topic, params }) => {
      console.log("EVENT", "session_update", { topic, params })
      const { namespaces } = params
      const _session = _client.session.get(topic)
      const updatedSession = { ..._session, namespaces }
      setSession(updatedSession)
    })

    _client.on("session_delete", () => {
      console.log("EVENT", "session_delete")
      reset()
    })
  }, [])

  const restoreExistingSession = useCallback(
    async (_client: Client) => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized")
      }

      if (typeof session !== "undefined") return

      // populates (the last) existing session to state
      if (_client.session.length) {
        const lastKeyIndex = _client.session.keys.length - 1
        const _session = _client.session.get(_client.session.keys[lastKeyIndex])
        console.log("RESTORED SESSION:", _session)
        setSession(_session)

        const networkIdentifier = _session.namespaces.vechain.accounts[0].split(
          ":"
        )[1] as Network

        //Set network and account
        dispatch({
          type: ActionType.SET_ALL,
          payload: {
            network: fromChainId(networkIdentifier),
            account: {
              address: _session.namespaces.vechain.accounts[0].split(":")[2],
              source: WalletSource.WALLET_CONNECT,
            },
          },
        })
        return _session
      }
    },
    [session]
  )

  const createClient = useCallback(async () => {
    try {
      setIsInitializing(true)

      const _client = await SignClient.init({
        logger: DEFAULT_LOGGER,
        relayUrl: DEFAULT_RELAY_URL,
        projectId: DEFAULT_PROJECT_ID,
        metadata: DEFAULT_APP_METADATA,
      })

      setClient(_client)

      await restoreExistingSession(_client)
      await subscribeToEvents(_client)
    } catch (err) {
      console.error("Failed to initialize WalletConnect client:", err)
      throw err
    } finally {
      setIsInitializing(false)
    }
  }, [restoreExistingSession, subscribeToEvents])

  useEffect(() => {
    if (!client) {
      createClient()
    }
  }, [createClient, client])

  const value = useMemo(
    () => ({
      isInitializing,
      client,
      session,
      connect,
      disconnect,
      identifyUser,
    }),
    [isInitializing, client, session, connect, disconnect, identifyUser]
  )

  return (
    <WalletConnectContext.Provider value={{ ...value }}>
      {children}
    </WalletConnectContext.Provider>
  )
}

export function useWalletConnect() {
  const context = useContext(WalletConnectContext)
  if (context === undefined) {
    throw new Error("useWalletConnect must be used within a CountProvider")
  }
  return context
}
