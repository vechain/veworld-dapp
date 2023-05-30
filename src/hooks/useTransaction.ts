import { useWalletConnect } from "../context/walletConnectContext"
import ConnexService from "../service/ConnexService"
import { useWallet } from "../context/walletContext"
import { WalletSource } from "../model/enums"

export const useTransaction = () => {
  const {
    state: { account },
  } = useWallet()
  const { client, session } = useWalletConnect()

  const requestTransaction = async (
    signer: string,
    txMessage: Connex.Vendor.TxMessage,
    comment?: string,
    delegateUrl?: string
  ) => {
    let result: Connex.Vendor.TxResponse

    if (account?.source === WalletSource.WALLET_CONNECT) {
      if (!client) throw new Error("Wallet Connect client not initialised")
      if (!session) throw new Error("Wallet Connect session not initialised")

      // console.log(`Sending delegate_transaction request to ${session.topic}`)
      result = await client.request({
        topic: session.topic,
        chainId: "vechain:100010", //TODO: fix this
        request: {
          method: "delegate_transaction", // TODO: rename
          params: [
            {
              signer,
              txMessage,
              comment,
              delegateUrl,
            },
          ],
        },
      })
      // console.log(`Received response from wallet connect ${result}`)
    } else {
      const connex = await ConnexService.getConnex()
      const request = connex.vendor
        .sign("tx", txMessage)
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
