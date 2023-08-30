import { useToast } from "@chakra-ui/react"
import { useState } from "react"
import { useWallet } from "../context/WalletContext"
import { INonFungibleToken } from "../model/State"
import { TxStage } from "../model/Transaction"
import { getErrorMessage } from "../utils/ExtensionUtils"
import { useTransaction } from "./useTransaction"
import { useVip181 } from "./useVip181"

const useMintNonFungibleToken = () => {
  const {
    state: { account },
  } = useWallet()
  const { requestTransaction } = useTransaction()
  const [txId, setTxId] = useState<string>()
  const [txStatus, setTxStatus] = useState(TxStage.NONE)
  const [error, setError] = useState<string>()
  const toast = useToast()
  const vip181 = useVip181()
  const { pollForReceipt, explainRevertReason } = useTransaction()

  const mintNonFungibleToken = async (
    nft: INonFungibleToken,
    toAddress: string,
    comment: string,
    clauseAmount: number
  ) => {
    setError(undefined)

    try {
      setTxStatus(TxStage.NONE)
      if (!account.address) throw new Error("You have not selected an account")

      const clauses = await vip181.buildMintNftClause(
        toAddress,
        nft.address,
        clauseAmount
      )

      const clausesWithComments = clauses.map((clause) => {
        return { ...clause, comment }
      })

      setTxStatus(TxStage.IN_EXTENSION)

      const { txid } = await requestTransaction(
        account.address,
        clausesWithComments
      )
      setTxId(txid)
      setTxStatus(TxStage.POLLING_TX)

      const receipt = await pollForReceipt(txid)

      if (receipt.reverted) {
        const revertReason = await explainRevertReason(txid)
        setTxStatus(TxStage.REVERTED)
        return toast({
          title: revertReason,
          status: "error",
          position: "bottom-left",
        })
      }

      setTxStatus(TxStage.COMPLETE)
    } catch (e) {
      console.error(e)
      setError(getErrorMessage(e))
      return toast({
        title: "Error minting token",
        status: "error",
        position: "bottom-left",
      })
    }
  }

  return { mintNonFungibleToken, error, txId, txStatus }
}

export default useMintNonFungibleToken
