import { WalletConnectModal } from "@walletconnect/modal"

/**
 * Creates a new WalletConnectModal instance
 * @param projectId - Your WalletConnect project ID
 * @param veWorldImage - The path to the VeWorld Mobile image
 */
export const newWeb3Modal = (projectId: string, veWorldImage: string) =>
  new WalletConnectModal({
    projectId,
    explorerRecommendedWalletIds: "NONE",
    mobileWallets: [
      {
        name: "VeWorld",
        id: "veworld-mobile",
        links: {
          native: "veworld://org.vechain.veworld.app/",
          universal: "https://veworld.com",
        },
      },
    ],
    themeVariables: {
      "--wcm-z-index": "99999999",
    },
    walletImages: {
      "veworld-mobile": veWorldImage,
    },
  })
