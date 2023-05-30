import { SignClient as Client } from "@walletconnect/sign-client/dist/types/client"
import { SessionTypes, PairingTypes } from "@walletconnect/types"
import React, {
  useContext,
  createContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react"
import { SignClient } from "@walletconnect/sign-client"
import { Web3Modal } from "@web3modal/standalone"
import { Network } from "../model/enums"
import { getSdkError } from "@walletconnect/utils"
import { Certificate } from "thor-devkit"
import {
  DEFAULT_APP_METADATA,
  DEFAULT_LOGGER,
  DEFAULT_PROJECT_ID,
  DEFAULT_RELAY_URL,
  SUPPORTED_CHAINS,
  DEFAULT_METHODS,
  DEFAULT_EVENTS,
} from "../constants"
import ConnexService from "../service/ConnexService"
import { ActionType, useWallet } from "./walletContext"

/**
 * Types
 */
interface IContext {
  client: Client | undefined
  session: SessionTypes.Struct | undefined
  connect: (
    network: Network,
    onSuccess: (session: SessionTypes.Struct) => Promise<void>,
    onError?: (err: unknown) => void,
    pairing?: { topic: string }
  ) => Promise<void>
  disconnect: () => Promise<void>
  isInitializing: boolean
  chains: string[]
  pairings: PairingTypes.Struct[]
  setChains: (chains: string[]) => void
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

const web3Modal = new Web3Modal({
  walletConnectVersion: 2,
  projectId: DEFAULT_PROJECT_ID,
  standaloneChains: SUPPORTED_CHAINS,
  themeVariables: {
    "--w3m-z-index": "99999999",
  },
})

interface IWalletConnectProvider {
  children: React.ReactNode
}

export const WalletConnectProvider = ({ children }: IWalletConnectProvider) => {
  const [client, setClient] = useState<Client>()
  const [pairings, setPairings] = useState<PairingTypes.Struct[]>([])
  const [session, setSession] = useState<SessionTypes.Struct>()

  const [isInitializing, setIsInitializing] = useState(false)
  const [chains, setChains] = useState<string[]>([])
  const { dispatch } = useWallet()

  const reset = () => {
    console.log("Resetting WalletConnect state")
    setSession(undefined)
    setChains([])

    ConnexService.clear()
    dispatch({ type: ActionType.CLEAR })
  }

  const onSessionConnected = useCallback(
    async (_session: SessionTypes.Struct) => {
      const allNamespaceChains = Object.keys(_session.namespaces)

      setSession(_session)
      setChains(allNamespaceChains)
    },
    []
  )

  const connect = useCallback(
    async (
      network: Network,
      onSuccess: (session: SessionTypes.Struct) => Promise<void>,
      onError?: (err: unknown) => void,
      pairing?: { topic: string }
    ) => {
      if (typeof client === "undefined") {
        throw new Error("WalletConnect is not initialized")
      }

      let session: SessionTypes.Struct | undefined
      try {
        const requiredNamespaces = {
          vechain: {
            methods: Object.values(DEFAULT_METHODS),
            chains: [`vechain:${network}`],
            events: Object.values(DEFAULT_EVENTS),
          },
        }
        console.log(
          "requiredNamespaces config for connect:",
          requiredNamespaces
        )

        const { uri, approval } = await client.connect({
          pairingTopic: pairing?.topic,
          requiredNamespaces,
        })

        //TODO: shouldn't this be if (!uri) throw error?
        if (uri) {
          // Create a flat array of all requested chains across namespaces.
          const standaloneChains = Object.values(requiredNamespaces)
            .map((namespace) => namespace.chains)
            .flat() as string[]

          web3Modal.openModal({ uri, standaloneChains })
        }

        //TODO: if modal closes before approval we should reset state

        session = await approval()
        console.log("Established session:", session)

        await onSessionConnected(session)
        setPairings(client.pairing.getAll({ active: true }))

        web3Modal.closeModal()

        await onSuccess(session)
      } catch (e) {
        web3Modal.closeModal()
        onError?.(e)

        throw e
      }
    },
    [chains, client, onSessionConnected]
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

        console.log(
          "Asking wallet to sign the message and identify itself",
          message
        )

        const result: Connex.Vendor.CertResponse = await client.request({
          topic: session.topic,
          chainId: `vechain:${network}`,
          request: {
            method: DEFAULT_METHODS.IDENTIFY,
            params: [message],
          },
        })

        console.log("Wallet response", result)
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
        throw error
      }
    },
    [client, session]
  )

  const disconnect = useCallback(async () => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized")
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

  const _subscribeToEvents = useCallback(
    async (_client: Client) => {
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
        onSessionConnected(updatedSession)
      })

      _client.on("session_delete", () => {
        console.log("EVENT", "session_delete")
        reset()
      })
    },
    [onSessionConnected]
  )

  const _checkPersistedState = useCallback(
    async (_client: Client) => {
      if (typeof _client === "undefined") {
        throw new Error("WalletConnect is not initialized")
      }

      // populates existing pairings to state
      setPairings(_client.pairing.getAll({ active: true }))
      console.log(
        "RESTORED PAIRINGS: ",
        _client.pairing.getAll({ active: true })
      )

      if (typeof session !== "undefined") return
      // populates (the last) existing session to state
      if (_client.session.length) {
        const lastKeyIndex = _client.session.keys.length - 1
        const _session = _client.session.get(_client.session.keys[lastKeyIndex])
        console.log("RESTORED SESSION:", _session)
        await onSessionConnected(_session)
        return _session
      }
    },
    [session, onSessionConnected]
  )

  const _deletePreviousPairings = useCallback(async (_client: Client) => {
    if (typeof _client === "undefined") {
      throw new Error("WalletConnect is not initialized")
    }

    // delete previous pairings
    const allPairings = _client.pairing.getAll({ active: true })
    for (const pairing of allPairings) {
      console.log("Deleting pairing:", pairing.topic)
      try {
        await _client.disconnect({
          topic: pairing.topic,
          reason: getSdkError("USER_DISCONNECTED"),
        })
      } catch (error) {
        console.error("SignClient.disconnect failed:", error)
      }
    }

    reset()
  }, [])

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
      await _deletePreviousPairings(_client)
      // await _checkPersistedState(_client)
      await _subscribeToEvents(_client)
    } catch (err) {
      console.error("Failed to initialize WalletConnect client:", err)
      throw err
    } finally {
      setIsInitializing(false)
    }
  }, [_checkPersistedState, _subscribeToEvents])

  useEffect(() => {
    if (!client) {
      createClient()
    }
  }, [createClient, client])

  const value = useMemo(
    () => ({
      pairings,
      isInitializing,
      chains,
      client,
      session,
      connect,
      disconnect,
      setChains,
      identifyUser,
    }),
    [
      pairings,
      isInitializing,
      chains,
      client,
      session,
      connect,
      disconnect,
      setChains,
      identifyUser,
    ]
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
