import { useWalletConnect } from "../context/walletConnectContext"
import ConnexService from "../service/ConnexService"
import { useWallet } from "../context/walletContext"
import { WalletSource } from "../model/enums"
import { DEFAULT_METHODS } from "../constants"
import { isMobile } from "../utils/MobileUtils"
import { getChainId } from "../utils/ChainUtil"

export const useTransaction = () => {
  const {
    state: { account, network },
  } = useWallet()
  const { client, session } = useWalletConnect()

  const requestTransaction = async (
    signer: string,
    message: Connex.Vendor.TxMessage,
    comment?: string,
    delegateUrl?: string
  ) => {
    let result: Connex.Vendor.TxResponse

    if (account?.source === WalletSource.WALLET_CONNECT) {
      if (!client) throw new Error("Wallet Connect client not initialised")
      if (!session) throw new Error("Wallet Connect session not initialised")
      if (!network) throw new Error("Network not initialised")

      const options: Connex.Driver.TxOptions = {
        signer,
        comment,
        delegator: delegateUrl ? { url: delegateUrl } : undefined,
      }

      const resPromise = client.request({
        topic: session.topic,
        chainId: getChainId(network),
        request: {
          method: DEFAULT_METHODS.REQUEST_TRANSACTION,
          params: [
            {
              message,
              options,
            },
          ],
        },
      })

      if (isMobile() && !document.hidden) window.open("wc://")

      result = (await resPromise) as Connex.Vendor.TxResponse
    } else {
      const connex = await ConnexService.getConnex()
      const request = connex.vendor
        .sign("tx", message)
        .signer(signer)
        .link(window.location.href + "#/tx-callback/{txid}")

      if (comment) request.comment(comment)
      if (delegateUrl) request.delegate(delegateUrl, signer)
      result = await request.request()
      // console.log(`Received response from extension : ${result}`)
    }
    return result
  }

  return {
    requestTransaction,
  }
}
