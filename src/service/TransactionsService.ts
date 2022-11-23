import { Connex } from "@vechain/connex"
import ConnexService from "./ConnexService"

const pollForReceipt = async (
  id: string
): Promise<Connex.Thor.Transaction.Receipt> => {
  const connex = await ConnexService.getConnex()

  const transaction = connex.thor.transaction(id)
  let receipt

  //Query the transaction until it has a receipt
  //Timeout after 3 blocks
  for (let i = 0; i < 3; i++) {
    receipt = await transaction.getReceipt()
    if (receipt) {
      break
    }
    await connex.thor.ticker().next()
  }

  if (!receipt) {
    throw new Error("Transaction receipt not found")
  }

  const transactionData = await transaction.get()

  if (!transactionData) throw Error("Failed to get TX data")

  return receipt
}

const explainRevertReason = async (id: string): Promise<string> => {
  const connex = await ConnexService.getConnex()

  const tx = connex.thor.transaction(id)
  const receipt = await tx.getReceipt()
  const transactionData = await tx.get()

  if (receipt && transactionData) {
    const explainedTransaction = await connex.thor
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

const requestTransaction = async (
  signer: string,
  txMessage: Connex.Vendor.TxMessage
  //delegateUrl?: string
) => {
  const connex = await ConnexService.getConnex()

  const request = connex.vendor
    .sign("tx", txMessage)
    .signer(signer)
    .comment("Deploy a custom VIP181 Token")

  //if (delegateUrl) request.delegate(delegateUrl, signer)

  return request.request()
}

export default {
  pollForReceipt,
  requestTransaction,
  explainRevertReason,
}
