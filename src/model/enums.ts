export enum WalletSource {
  VEWORLD = "veworld",
  SYNC2 = "sync2",
}

const logosUrl = process.env.PUBLIC_URL + "/images/logo"

interface IWalletSourceInfo {
  name: string
  logo?: string
  url?: string
  isAvailable: boolean
}

export const WalletSourceInfo: Record<WalletSource, IWalletSourceInfo> = {
  [WalletSource.VEWORLD]: {
    name: "VeWorld",
    logo: `${logosUrl}/veworld_black.png`,
    isAvailable: !!window.vechain,
  },
  [WalletSource.SYNC2]: {
    name: "Sync2",
    logo: `${logosUrl}/sync2.png`,
    url: "https://docs.vechain.org/sync2/get-started.html",
    isAvailable: true,
  },
}

export const DEFAULT_SOURCE = window.vechain
  ? WalletSource.VEWORLD
  : WalletSource.SYNC2

export enum Network {
  SOLO = "solo",
}

export const NetworkInfo: Record<Network, { name: string; url: string }> = {
  [Network.SOLO]: {
    name: "Solo",
    url: "http://localhost:8669",
  },
}

export const DEFAULT_NETWORK = Network.SOLO
