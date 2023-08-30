import { Network, NetworkInfo } from "../model/enums"
import { genesisBlocks } from "@vechain/connex/esm/config"

export const chainIdFromGenesis = (genesisId: string) =>
  `vechain:${genesisId.slice(-32)}`

export const getChainId = (network: Network) =>
  `vechain:${chainIdFromGenesis(NetworkInfo[network].genesis.id)}`

export const fromChainId = (chainId: string): Network => {
  const net = Object.values(NetworkInfo).find(
    (net) => net.genesis.id.slice(-32) === chainId
  )

  return net?.genesis.id === genesisBlocks.main.id ? Network.MAIN : Network.TEST
}
