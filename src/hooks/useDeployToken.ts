import { useToast } from "@chakra-ui/react"
import { useState } from "react"
import { TxStage } from "../model/Transaction"
import TransactionsService from "../service/TransactionsService"
import VIP180Service from "../service/VIP180Service"
import { getErrorMessage } from "../utils/ExtensionUtils"

const useDeployToken = () => {
  const [txId, setTxId] = useState<string>()
  const [txStatus, setTxStatus] = useState(TxStage.NONE)
  const [error, setError] = useState<string>()
  const toast = useToast()

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

      const clause = VIP180Service.buildDeployClause(name, symbol, decimals)

      setTxStatus(TxStage.IN_EXTENSION)

      const { txid } = await TransactionsService.requestTransaction(
        accountAddress,
        clause,
        comment,
        delegateUrl
      )
      setTxId(txid)
      setTxStatus(TxStage.POLLING_TX)

      const receipt = await TransactionsService.pollForReceipt(txid)

      if (receipt.reverted) {
        const revertReason = await TransactionsService.explainRevertReason(txid)
        setTxStatus(TxStage.REVERTED)
        return toast({
          title: revertReason,
          position: "bottom-left",
          status: "error",
        })
      }

      const address = receipt.outputs[0].contractAddress as string
      const token = await VIP180Service.getToken(address)

      setTxStatus(TxStage.COMPLETE)
      return { token, receipt, txId }
    } catch (e) {
      console.error(e)
      setTxStatus(TxStage.FAILURE)
      setError(getErrorMessage(e))
      //   return toast({
      //     title: "Transaction failed for some unknown reason. Last know status: ",
      //     description: txStatus,
      //     position: "bottom-left",
      //     status: "error",
      //   })
    }
  }

  return { deployToken, error, txId, txStatus }
}

export default useDeployToken
