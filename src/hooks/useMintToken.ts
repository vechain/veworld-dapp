import { useToast } from "@chakra-ui/react"
import { useState } from "react"
import { MintTokenForm } from "../components/Tokens/MintToken/MintToken"
import { useWallet } from "../context/WalletContext"
import { IToken } from "../model/State"
import { TxStage } from "../model/Transaction"
import { getErrorMessage } from "../utils/ExtensionUtils"
import { useTransaction } from "./useTransaction"
import { useVip180 } from "./useVip180"

const useMintToken = () => {
  const {
    state: { account },
  } = useWallet()
  const { requestTransaction } = useTransaction()
  const [txId, setTxId] = useState<string>()
  const [txStatus, setTxStatus] = useState(TxStage.NONE)
  const [error, setError] = useState<string>()
  const toast = useToast()
  const { buildMintClause } = useVip180()
  const { pollForReceipt, explainRevertReason } = useTransaction()

  const mintToken = async (
    token: IToken,
    data: MintTokenForm,
    comment?: string
  ) => {
    setError(undefined)

    try {
      setTxStatus(TxStage.NONE)
      if (!account.address) throw new Error("You have not selected an account")

      const clauses = await buildMintClause(
        data.address,
        data.amount,
        data.clausesNumber,
        token.address,
        token.decimals
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

  return { mintToken, error, txId, txStatus }
}

export default useMintToken
