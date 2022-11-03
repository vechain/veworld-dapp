import React from "react"
import { TxStage } from "../../model/Transaction"
import { Alert } from "antd"

interface TransactionStatusProps {
  setTxStage: (txStage: TxStage) => void
  txStage: TxStage
  txId?: string
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({
  setTxStage,
  txStage,
  txId,
}) => {
  switch (txStage) {
    case TxStage.NONE:
      return <></>
    case TxStage.IN_EXTENSION:
      return (
        <Alert
          message={"Waiting for confirmation in extension"}
          type={"warning"}
          showIcon
        />
      )
    case TxStage.POLLING_TX:
      return (
        <Alert
          message={"Polling the blockchain for the transaction"}
          type={"warning"}
          description={txId ? `Transaction ID: ${txId}` : undefined}
          showIcon
        />
      )
    case TxStage.FAILURE:
      return (
        <Alert
          onClick={() => setTxStage(TxStage.NONE)}
          message={"Transaction failed"}
          type={"error"}
          description={txId ? `Transaction ID: ${txId}` : undefined}
        />
      )
    case TxStage.COMPLETE:
      return (
        <Alert
          onClick={() => setTxStage(TxStage.NONE)}
          message={"Transaction successful"}
          type={"success"}
          showIcon
          description={txId ? `Transaction ID: ${txId}` : undefined}
        />
      )
    case TxStage.REVERTED:
      return (
        <Alert
          onClick={() => setTxStage(TxStage.NONE)}
          message={"Transaction reverted"}
          type={"error"}
          showIcon
          description={txId ? `Transaction ID: ${txId}` : undefined}
        />
      )
    default:
      return <></>
  }
}

export default TransactionStatus
