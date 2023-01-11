import React, {
  useReducer,
  useContext,
  createContext,
  useMemo,
  useEffect,
} from "react"
import LocalStorageService from "../service/LocalStorageService"
import ConnexService from "../service/ConnexService"
import { IAccount } from "../model/State"

import { Network } from "../model/enums"

export enum ActionType {
  SET_ALL = "SET_ALL",
  SET_NETWORK = "SET_NETWORK",
  SET_ACCOUNT = "SET_ACCOUNT",
  CLEAR = "CLEAR",
}

type Action =
  | {
      type: ActionType.SET_ALL
      payload: { network: Network; account: IAccount }
    }
  | { type: ActionType.SET_NETWORK; payload: Network }
  | { type: ActionType.SET_ACCOUNT; payload: IAccount }
  | { type: ActionType.CLEAR }

type Dispatch = (action: Action) => void

export type State = { account?: IAccount; network?: Network }

type ContextStateProps = { state: State; dispatch: Dispatch }

const walletReducerDefaultValue = {
  account: LocalStorageService.getAccount(),
  network: LocalStorageService.getNetwork(),
}

const walletReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.SET_ALL:
      LocalStorageService.setAccount(action.payload.account)
      LocalStorageService.setNetwork(action.payload.network)
      return { ...state, ...action.payload }
    case ActionType.SET_ACCOUNT:
      LocalStorageService.setAccount(action.payload)
      return { ...state, account: action.payload }
    case ActionType.SET_NETWORK:
      LocalStorageService.setNetwork(action.payload)
      return { ...state, network: action.payload }
    case ActionType.CLEAR:
      LocalStorageService.clear()
      ConnexService.clear()
      return { network: undefined, account: undefined }
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

  useEffect(() => {
    const { account, network } = state
    if (account?.source && network) {
      ConnexService.initialise(account.source, network)
    }
  }, [state])

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
