import { useState } from "react"
import { TxStage } from "../model/Transaction"
import { getErrorMessage } from "../utils/ExtensionUtils"
import { useTransaction } from "./useTransaction"
import { useVip180 } from "./useVip180"

const useDeployToken = () => {
  const [txId, setTxId] = useState<string>()
  const [txStatus, setTxStatus] = useState(TxStage.NONE)
  const [error, setError] = useState<string>()
  const { requestTransaction } = useTransaction()
  const { buildDeployClause, getToken } = useVip180()
  const { pollForReceipt, explainRevertReason } = useTransaction()

  const deployToken = async (
    accountAddress: string,
    name: string,
    symbol: string,
    decimals: number,
    delegateUrl?: string,
    comment?: string
  ) => {
    setError(undefined)
    try {
      setTxId(undefined)
      setTxStatus(TxStage.NONE)

      const clause = buildDeployClause(name, symbol, decimals)

      setTxStatus(TxStage.IN_EXTENSION)

      const { txid } = await requestTransaction(
        accountAddress,
        clause,
        comment,
        delegateUrl
      )
      setTxId(txid)
      setTxStatus(TxStage.POLLING_TX)

      const receipt = await pollForReceipt(txid)
      console.log(receipt)

      if (receipt.reverted) {
        const revertReason = await explainRevertReason(txid)
        setTxStatus(TxStage.REVERTED)
        return revertReason
      }

      const address = receipt.outputs[0].contractAddress as string
      const token = await getToken(address)

      setTxStatus(TxStage.COMPLETE)
      return { token, receipt, txId }
    } catch (e) {
      console.error(e)
      setTxStatus(TxStage.FAILURE)
      setError(getErrorMessage(e))
    }
  }

  return { deployToken, error, txId, txStatus }
}

export default useDeployToken
