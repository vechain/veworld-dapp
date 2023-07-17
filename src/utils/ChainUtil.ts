import { Network, NetworkInfo } from "../model/enums"

export const getChainId = (network: Network) =>
  `vechain:${NetworkInfo[network].genesis.id.slice(-32)}`
