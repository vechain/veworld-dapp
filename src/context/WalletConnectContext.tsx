import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react"
import { WalletSource } from "../model/enums"
import { WC_APP_METADATA, WC_PROJECT_ID, WC_RELAY_URL } from "../constants"
import { ActionType, useWallet } from "./WalletContext"
import { fromChainId } from "../utils/ChainUtil"
import { newWcClient, newWcSigner, newWeb3Modal } from "../wallet-connect"
import { WcSigner } from "../wallet-connect/wc-signer"
import { genesisBlocks } from "@vechain/connex/esm/config"

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
  const signer = useRef<WcSigner>()

  const web3Modal = useRef(newWeb3Modal(WC_PROJECT_ID))
  const client = useRef(
    newWcClient(WC_PROJECT_ID, WC_RELAY_URL, WC_APP_METADATA)
  )

  const {
    dispatch,
    state: { account, network },
  } = useWallet()

  const onRestored = useCallback(
    (accountAddress: string, networkIdentifier: string) => {
      dispatch({
        type: ActionType.SET_ALL,
        payload: {
          network: fromChainId(networkIdentifier),
          account: {
            address: accountAddress,
            source: WalletSource.WALLET_CONNECT,
          },
        },
      })
    },
    [dispatch]
  )

  const onDisconnect = useCallback(async () => {
    dispatch({ type: ActionType.CLEAR })
  }, [dispatch])

  const wcSigner = useMemo(() => {
    const _signer = newWcSigner(
      genesisBlocks[network].id,
      client.current,
      web3Modal.current,
      onRestored,
      onDisconnect
    )

    signer.current = _signer

    return _signer
  }, [network, onRestored, onDisconnect])

  /**
   * If the user disconnects the wallet, we need to clean up wallet connect
   */
  useEffect(() => {
    if (!account.address) signer.current?.disconnect()
  }, [account])

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
