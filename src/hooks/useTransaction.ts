import { useConnex } from "@vechain/dapp-kit-react"

export const useTransaction = () => {
  const { thor, vendor } = useConnex()

  const requestTransaction = async (
    signer: string,
    message: Connex.Vendor.TxMessage,
    comment?: string,
    delegateUrl?: string
  ) => {
    const request = vendor
      .sign("tx", message)
      .signer(signer)
      .link(window.location.href + "#/tx-callback/{txid}")

    if (comment) request.comment(comment)
    if (delegateUrl) request.delegate(delegateUrl, signer)
    return await request.request()
  }

  const pollForReceipt = async (
    id: string
  ): Promise<Connex.Thor.Transaction.Receipt> => {
    const transaction = thor.transaction(id)
    let receipt

    //Query the transaction until it has a receipt
    //Timeout after 3 blocks
    for (let i = 0; i < 3; i++) {
      receipt = await transaction.getReceipt()
      if (receipt) {
        break
      }
      await thor.ticker().next()
    }

    if (!receipt) {
      throw new Error("Transaction receipt not found")
    }

    const transactionData = await transaction.get()

    if (!transactionData) throw Error("Failed to get TX data")

    return receipt
  }

  const explainRevertReason = async (id: string): Promise<string> => {
    const tx = thor.transaction(id)
    const receipt = await tx.getReceipt()
    const transactionData = await tx.get()

    if (receipt && transactionData) {
      const explainedTransaction = await thor
        .explain(transactionData?.clauses)
        .caller(transactionData?.origin)
        .execute()

      if (receipt.reverted) {
        return explainedTransaction
          .map(({ revertReason }) => revertReason)
          .join(" ,")
      }
    }

    return "No revert reason found"
  }

  return {
    requestTransaction,
    pollForReceipt,
    explainRevertReason,
  }
}
