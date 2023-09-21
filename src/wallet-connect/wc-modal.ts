import { WalletConnectModal } from "@walletconnect/modal"

export const newWeb3Modal = (projectId: string) =>
  new WalletConnectModal({
    projectId,
    explorerRecommendedWalletIds: "NONE",
    mobileWallets: [
      {
        name: "VeWorld",
        id: "veworld-mobile",
        links: {
          native: "veworld://org.vechain.veworld.app/",
          universal: "https://veworld.net",
        },
      },
    ],
    themeVariables: {
      "--wcm-z-index": "99999999",
    },
    walletImages: {
      "veworld-mobile": process.env.PUBLIC_URL + "/images/logo/veWorld.png",
    },
  })
