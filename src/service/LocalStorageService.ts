import { IAccount, INonFungibleToken, IToken } from "../model/State"
import { Network } from "../model/enums"

export const ACCOUNT_KEY = "PREVIOUS_ACCOUNT_KEY"
export const TOKENS_KEY = "TOKENS_KEY"
export const NFTS_KEY = "NFTS_KEY"
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

const getNetwork = (): Network => {
  const network = localStorage.getItem(NETWORK_KEY)

  if (network === Network.MAIN || network === Network.TEST) return network

  return Network.TEST
}

const setTokens = (token: IToken[]) => {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(token))
}

const getTokens = (): IToken[] => {
  const token = localStorage.getItem(TOKENS_KEY)
  if (token) return JSON.parse(token)
  return []
}

const setNfts = (nfts: INonFungibleToken[]) => {
  localStorage.setItem(NFTS_KEY, JSON.stringify(nfts))
}

const getNfts = (): INonFungibleToken[] => {
  const nft = localStorage.getItem(NFTS_KEY)
  if (nft) return JSON.parse(nft)
  return []
}

const clear = () => {
  localStorage.removeItem(ACCOUNT_KEY)
  localStorage.removeItem(NETWORK_KEY)
  localStorage.removeItem(TOKENS_KEY)
  localStorage.removeItem(NFTS_KEY)
}

export default {
  setAccount,
  getAccount,
  setNetwork,
  getNetwork,
  setTokens,
  getTokens,
  setNfts,
  getNfts,
  clear,
}
