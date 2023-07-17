import { Network, NetworkInfo } from "../model/enums"

export const getChainId = (network: Network) =>
  `vechain:${NetworkInfo[network].genesis.id.slice(-32)}`

export const fromChainId = (chainId: string): Network => {
  Object.entries(NetworkInfo).find(([key, value]) => {
    if (value.genesis.id.slice(-32) === chainId) return key
  })

  throw new Error("Invalid chainId")
}
