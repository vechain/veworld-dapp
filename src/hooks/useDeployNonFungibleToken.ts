import { useState } from "react"
import { TxStage } from "../model/Transaction"
import { getErrorMessage } from "../utils/ExtensionUtils"
import { useTransaction } from "./useTransaction"
import { useVip181 } from "./useVip181"

const useDeployNonFungibleToken = () => {
  const [txId, setTxId] = useState<string>()
  const [txStatus, setTxStatus] = useState(TxStage.NONE)
  const [error, setError] = useState<string>()
  const { requestTransaction } = useTransaction()
  const { buildNftDeployClause, getNonFungibleToken } = useVip181()
  const { pollForReceipt, explainRevertReason } = useTransaction()

  const deployNftContract = async (
    accountAddress: string,
    name: string,
    symbol: string,
    baseTokenURI: string,
    delegateUrl?: string,
    comment?: string
  ) => {
    setError(undefined)
    try {
      setTxId(undefined)
      setTxStatus(TxStage.NONE)

      const clause = buildNftDeployClause(name, symbol, baseTokenURI)

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
      const nft = await getNonFungibleToken(address)

      setTxStatus(TxStage.COMPLETE)
      return { nft, receipt, txId }
    } catch (e) {
      console.error(e)
      setTxStatus(TxStage.FAILURE)
      setError(getErrorMessage(e))
    }
  }

  return { deployNftContract, error, txId, txStatus }
}

export default useDeployNonFungibleToken
