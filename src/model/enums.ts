import { genesisBlocks } from "@vechain/connex/esm/config"
import { WalletSource } from "@vechain/dapp-kit"

const logosUrl = process.env.PUBLIC_URL + "/images/logo"

interface IWalletSourceInfo {
  name: string
  logo?: string
  url?: string
  isAvailable: boolean
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const WalletSourceInfo: Record<WalletSource, IWalletSourceInfo> = {
  veworld: {
    name: "VeWorld Web",
    logo: `${logosUrl}/veworld_black.png`,
    isAvailable: !!window.vechain,
  },
  sync2: {
    name: "Sync2",
    logo: `${logosUrl}/sync2.png`,
    url: "https://docs.vechain.org/sync2/get-started.html",
    isAvailable: true,
  },
  "wallet-connect": {
    name: "VeWorld Mobile",
    logo: `${logosUrl}/wallet-connect-logo.png`,
    isAvailable: true,
  },
}

export enum Network {
  MAIN = "main",
  TEST = "test",
}

export const NetworkInfo: Record<
  Network,
  { name: string; url: string; genesis: Connex.Thor.Block }
> = {
  [Network.MAIN]: {
    name: "Mainnet",
    url: "https://vethor-node.vechain.com",
    genesis: genesisBlocks.main,
  },
  [Network.TEST]: {
    name: "Testnet",
    url: "https://vethor-node-test.vechaindev.com",
    genesis: genesisBlocks.test,
  },
}

export const DEFAULT_NETWORK = Network.TEST
