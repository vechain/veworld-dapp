import { IAccount, IToken } from "../model/State"
import { Network } from "../model/enums"

export const ACCOUNT_KEY = "PREVIOUS_ACCOUNT_KEY"
export const TOKENS_KEY = "TOKENS_KEY"
export const NETWORK_KEY = "NETWORK_KEY"

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

const setTokens = (token: IToken[]) => {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(token))
}

const getTokens = (): IToken[] => {
  const token = localStorage.getItem(TOKENS_KEY)
  if (token) return JSON.parse(token)
  return []
}

const clear = () => {
  localStorage.removeItem(ACCOUNT_KEY)
  localStorage.removeItem(NETWORK_KEY)
  localStorage.removeItem(TOKENS_KEY)
}

export default {
  setAccount,
  getAccount,
  setNetwork,
  getNetwork,
  setTokens,
  getTokens,
  clear,
}
