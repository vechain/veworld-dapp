import { Connex } from "@vechain/connex"
import { WalletSource } from "./LocalStorageService"

let connex: Connex | undefined

export enum Network {
  MAIN = "main",
  TEST = "test",
}

export interface INetwork {
  type: Network
  name: string
  color: string
}

export const Networks: INetwork[] = [
  {
    type: Network.MAIN,
    name: "Mainnet",
    color: "orange",
  },
  {
    type: Network.TEST,
    name: "Testnet",
    color: "green",
  },
]

const TEST_NET = "https://vethor-node-test.vechaindev.com"
const MAIN_NET = "https://vethor-node.vechain.com"

const initialise = (walletSource: WalletSource, network: Network) => {
  connex = new Connex({
    node: network === Network.MAIN ? MAIN_NET : TEST_NET,
    network,
    noExtension: walletSource === WalletSource.SYNC2,
  })

  return connex
}

const getConnex = async () => {
  if (!connex) throw new Error("Connex not initialised")

  return connex
}

const clear = () => {
  connex = undefined
}

export default {
  getConnex,
  initialise,
  clear,
}
