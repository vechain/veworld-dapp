import { SessionTypes } from "@walletconnect/types"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react"
import SignClient from "@walletconnect/sign-client"
import { Network, WalletSource } from "../model/enums"
import { getSdkError } from "@walletconnect/utils"
import {
  DEFAULT_APP_METADATA,
  DEFAULT_EVENTS,
  DEFAULT_LOGGER,
  DEFAULT_METHODS,
  DEFAULT_PROJECT_ID,
  DEFAULT_RELAY_URL,
  SUPPORTED_CHAINS,
} from "../constants"
import { ActionType, useWallet } from "./WalletContext"
import { WalletConnectModal } from "@walletconnect/modal"
import { EngineTypes } from "@walletconnect/types/dist/types/sign-client/engine"
import { fromChainId } from "../utils/ChainUtil"
import { WalletConnectSigner } from "./helpers/WalletConnectSigner"
import LocalStorage from "./helpers/LocalStorage"

/**
 * Types
 */
interface IContext {
  newWcSigner: (genesisId: string) => WalletConnectSigner
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
        native: "veworld://org.vechain.veworld.app/",
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
  const client = useRef<SignClient>()
  const session = useRef<SessionTypes.Struct>()

  const {
    dispatch,
    state: {
      account: { source },
    },
  } = useWallet()

  const reset = useCallback(() => {
    console.log("Resetting WalletConnect state")
    session.current = undefined

    dispatch({ type: ActionType.CLEAR })
  }, [dispatch])

  const connect = useCallback(
    async (signClient: SignClient): Promise<SessionTypes.Struct> => {
      try {
        const requiredNamespaces: EngineTypes.ConnectParams["requiredNamespaces"] =
          {
            vechain: {
              methods: Object.values(DEFAULT_METHODS),
              chains: SUPPORTED_CHAINS,
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

        //TODO: if user closes modal before approving on mobile state is not reset
        web3Modal.subscribeModal(async (ev: { open: boolean }) => {
          console.log(ev.open ? "Modal opened" : "Modal closed")
        })

        session.current = await approval()

        return session.current
      } catch (e) {
        console.warn("WalletConnect connect failed:", e)
        throw e
      } finally {
        web3Modal.closeModal()
      }
    },
    []
  )

  const newWcSigner = useCallback(
    (genesisId: string) =>
      new WalletConnectSigner(genesisId, client, session, connect),
    [connect]
  )

  const disconnect = useCallback(async () => {
    if (!client.current || !session.current) return

    try {
      await client.current.disconnect({
        topic: session.current.topic,
        reason: getSdkError("USER_DISCONNECTED"),
      })

      session.current = undefined
    } catch (error) {
      console.error("SignClient.disconnect failed:", error)
    }
  }, [])

  const subscribeToEvents = useCallback(
    async (_client: SignClient) => {
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
        const updatedSession = { ..._session, namespaces }
        session.current = updatedSession
      })

      _client.on("session_delete", () => {
        console.log("EVENT", "session_delete")
        reset()
      })
    },
    [reset]
  )

  const restoreExistingSession = useCallback(
    async (_client: SignClient) => {
      if (typeof session.current !== "undefined") return

      // populates (the last) existing session to state
      if (_client.session.length) {
        const lastKeyIndex = _client.session.keys.length - 1
        const _session = _client.session.get(_client.session.keys[lastKeyIndex])
        console.log("RESTORED SESSION:", _session)
        session.current = _session

        const networkIdentifier = _session.namespaces.vechain.accounts[0].split(
          ":"
        )[1] as Network

        const account = LocalStorage.getAccount()

        if (!account) {
          await _client.disconnect({
            topic: _session.topic,
            reason: {
              code: 4100,
              message: "Session expired",
            },
          })
          return
        }

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
    [dispatch]
  )

  const setupClient = useCallback(async () => {
    try {
      if (client.current) return

      const _client = await SignClient.init({
        logger: DEFAULT_LOGGER,
        relayUrl: DEFAULT_RELAY_URL,
        projectId: DEFAULT_PROJECT_ID,
        metadata: DEFAULT_APP_METADATA,
      })

      client.current = _client
      await restoreExistingSession(_client)
      await subscribeToEvents(_client)
    } catch (err) {
      console.error("Failed to initialize WalletConnect client:", err)
      throw err
    }
  }, [restoreExistingSession, subscribeToEvents])

  useEffect(() => {
    if (!client.current) setupClient()
  }, [setupClient])

  useEffect(() => {
    if (source !== WalletSource.WALLET_CONNECT) disconnect()
  }, [source, disconnect])

  const value: IContext = {
    newWcSigner,
  }

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
