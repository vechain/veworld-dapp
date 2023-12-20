import React, { createContext, useContext, useMemo, useReducer } from "react"
import LocalStorage from "./helpers/LocalStorage"
import { INonFungibleToken, IToken } from "../model/State"
import { DAppKitProvider } from "@vechain/dapp-kit-react"
import { WalletConnectOptions } from "@vechain/dapp-kit"
import { CustomizedStyle } from "@vechain/dapp-kit-ui"
import { WC_APP_METADATA, WC_PROJECT_ID } from "../constants"

import { Network, NetworkInfo } from "../model/enums"

export enum ActionType {
  SET_ALL = "SET_ALL",
  SET_NETWORK = "SET_NETWORK",
  ADD_TOKEN = "ADD_TOKEN",
  ADD_NFT = "ADD_NFT",
  CLEAR = "CLEAR",
}

type Action =
  | {
      type: ActionType.SET_ALL
      payload: { network: Network }
    }
  | { type: ActionType.SET_NETWORK; payload: Network }
  | { type: ActionType.ADD_TOKEN; payload: IToken }
  | { type: ActionType.ADD_NFT; payload: INonFungibleToken }
  | { type: ActionType.CLEAR }

type Dispatch = (action: Action) => void

export type State = {
  network: Network
  tokens: IToken[]
  nfts: INonFungibleToken[]
}

type ContextStateProps = { state: State; dispatch: Dispatch }

const walletReducerDefaultValue = {
  network: LocalStorage.getNetwork() || Network.TEST,
  tokens: LocalStorage.getTokens(),
  nfts: LocalStorage.getNfts(),
}

const walletReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_ALL:
      LocalStorage.setNetwork(action.payload.network)
      return { ...state, ...action.payload }
    case ActionType.ADD_TOKEN: {
      const updatedTokens = [...state.tokens, action.payload]
      LocalStorage.setTokens(updatedTokens)
      return { ...state, tokens: updatedTokens }
    }
    case ActionType.ADD_NFT: {
      const updatedNfts = [...state.nfts, action.payload]
      LocalStorage.setNfts(updatedNfts)
      return { ...state, nfts: updatedNfts }
    }
    case ActionType.SET_NETWORK:
      LocalStorage.setNetwork(action.payload)
      return { ...state, network: action.payload }
    case ActionType.CLEAR:
      LocalStorage.clear()
      return {
        network: Network.TEST,
        tokens: [],
        nfts: [],
      }
    default: {
      throw new Error(`Unhandled action type: ${action}`)
    }
  }
}

const WalletContext = createContext<ContextStateProps | undefined>(undefined)

interface IWalletProvider {
  children: React.ReactNode
}

const walletKitStyles: CustomizedStyle = {
  "--vwk-modal-z-index": "9999",
}

const AppStateProvider = ({ children }: IWalletProvider) => {
  const [state, dispatch] = useReducer(walletReducer, walletReducerDefaultValue)

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  )

  const walletConnectOptions: WalletConnectOptions = {
    projectId: WC_PROJECT_ID,
    metadata: WC_APP_METADATA,
  }

  return (
    <DAppKitProvider
      nodeUrl={NetworkInfo[state.network].url}
      genesis={state.network}
      walletConnectOptions={walletConnectOptions}
      usePersistence={true}
      logLevel={"DEBUG"}
      customStyles={walletKitStyles}
    >
      <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
    </DAppKitProvider>
  )
}

function useAppState() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useAppState must be used within a CountProvider")
  }
  return context
}

export { AppStateProvider, useAppState }
