import React, { createContext, useContext, useMemo, useReducer } from "react"
import LocalStorage from "./helpers/LocalStorage"
import { IAccount, INonFungibleToken, IToken } from "../model/State"

import { Network, WalletSource } from "../model/enums"

export enum ActionType {
  SET_ALL = "SET_ALL",
  SET_NETWORK = "SET_NETWORK",
  SET_ACCOUNT = "SET_ACCOUNT",
  ADD_TOKEN = "ADD_TOKEN",
  ADD_NFT = "ADD_NFT",
  CLEAR = "CLEAR",
}

type Action =
  | {
      type: ActionType.SET_ALL
      payload: { network: Network; account: IAccount }
    }
  | { type: ActionType.SET_NETWORK; payload: Network }
  | { type: ActionType.SET_ACCOUNT; payload: IAccount }
  | { type: ActionType.ADD_TOKEN; payload: IToken }
  | { type: ActionType.ADD_NFT; payload: INonFungibleToken }
  | { type: ActionType.CLEAR }

type Dispatch = (action: Action) => void

export type State = {
  account: IAccount
  network: Network
  tokens: IToken[]
  nfts: INonFungibleToken[]
}

type ContextStateProps = { state: State; dispatch: Dispatch }

const defaultAccount: IAccount = {
  source: window.vechain ? WalletSource.VEWORLD_EXTENSION : WalletSource.SYNC2,
}

const walletReducerDefaultValue = {
  account: LocalStorage.getAccount() || defaultAccount,
  network: LocalStorage.getNetwork() || Network.TEST,
  tokens: LocalStorage.getTokens(),
  nfts: LocalStorage.getNfts(),
}

const walletReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_ALL:
      LocalStorage.setAccount(action.payload.account)
      LocalStorage.setNetwork(action.payload.network)
      return { ...state, ...action.payload }
    case ActionType.SET_ACCOUNT:
      LocalStorage.setAccount(action.payload)
      return { ...state, account: action.payload }
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
        account: defaultAccount,
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

const WalletProvider = ({ children }: IWalletProvider) => {
  const [state, dispatch] = useReducer(walletReducer, walletReducerDefaultValue)

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  )

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  )
}

function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a CountProvider")
  }
  return context
}

export { WalletProvider, useWallet }
