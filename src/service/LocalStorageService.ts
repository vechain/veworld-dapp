import { Network } from "./ConnexService"
import { Token } from "../pages/Homepage/Homepage"
import { IAccount } from "../model/State"

export const ACCOUNT_KEY = "PREVIOUS_ACCOUNT_KEY"
export const TOKEN_KEY = "TOKEN_KEY"
export const NETWORK_KEY = "NETWORK_KEY"

export enum WalletSource {
  VEWORLD = "veworld",
  SYNC2 = "sync2",
}

const setAccount = (account: IAccount) => {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account))
}

const getAccount = (): IAccount | undefined => {
  const previousAccount = localStorage.getItem(ACCOUNT_KEY)

  if (previousAccount) {
    return JSON.parse(previousAccount)
  }
}

const setNetwork = (network: Network) => {
  localStorage.setItem(NETWORK_KEY, network)
}

const getNetwork = (): Network | undefined => {
  const network = localStorage.getItem(NETWORK_KEY)

  if (network === Network.MAIN || network === Network.TEST) return network
}

const setToken = (token: Token) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
}

const getToken = (): Token | undefined => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    return JSON.parse(token)
  }
}

const clear = () => {
  localStorage.removeItem(ACCOUNT_KEY)
  localStorage.removeItem(NETWORK_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

export default {
  setAccount,
  getAccount,
  setNetwork,
  getNetwork,
  setToken,
  getToken,
  clear,
}
