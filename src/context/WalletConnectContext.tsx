import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react"
import { WC_APP_METADATA, WC_PROJECT_ID, WC_RELAY_URL } from "../constants"
import { ActionType, useWallet } from "./WalletContext"
import {
  newWcClient,
  newWcSigner,
  newWeb3Modal,
  Signer,
} from "../wallet-connect"
import { genesisBlocks } from "@vechain/connex/esm/config"
import { WalletSource } from "../model/enums"

/**
 * Types
 */
interface IContext {
  wcSigner: ReturnType<typeof newWcSigner>
}

/**
 * Context
 */
export const WalletConnectContext = createContext<IContext>({} as IContext)

interface IWalletConnectProvider {
  children: React.ReactNode
}

export const WalletConnectProvider = ({ children }: IWalletConnectProvider) => {
  const signer = useRef<Signer>()

  const web3Modal = useRef(
    newWeb3Modal(
      WC_PROJECT_ID,
      process.env.PUBLIC_URL + "/images/logo/veWorld.png"
    )
  )
  const client = useRef(
    newWcClient(
      WC_PROJECT_ID,
      WC_RELAY_URL,
      WC_APP_METADATA,
      process.env.NODE_ENV === "development" ? "debug" : ""
    )
  )

  const {
    dispatch,
    state: { account, network },
  } = useWallet()

  const onDisconnect = useCallback(async () => {
    dispatch({ type: ActionType.CLEAR })
  }, [dispatch])

  /**
   * If the user disconnects the wallet, we need to clean up wallet connect
   */
  useEffect(() => {
    if (!account.address) signer.current?.disconnect()
  }, [account])

  const cleanStorage = useCallback(async () => {
    const _client = await client.current.get()

    const keys = await _client.core.storage.getKeys()

    for (const key of keys) {
      if (!key.startsWith("wc@2")) continue
      console.log("Removing WC key", key)
      await _client.core.storage.removeItem(key)
    }
  }, [])

  useEffect(() => {
    if (account.source !== WalletSource.WALLET_CONNECT || !account.address) {
      cleanStorage()
        .then(() => console.log("Cleaned WC storage"))
        .catch((e) => console.error("Failed to clean WC storage", e))
    }
  }, [account, cleanStorage])

  const wcSigner = useMemo(() => {
    const _signer = newWcSigner(
      genesisBlocks[network].id,
      client.current,
      web3Modal.current,
      onDisconnect
    )

    signer.current = _signer

    return _signer
  }, [network, onDisconnect])

  const value: IContext = {
    wcSigner,
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
