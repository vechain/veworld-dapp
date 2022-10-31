import React from "react"
import { TxStage } from "../../model/Transaction"
import { Alert } from "antd"

interface TransactionStatusProps {
  txStage: TxStage
  txId?: string
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({
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
          message={"Transaction failed"}
          type={"error"}
          description={txId ? `Transaction ID: ${txId}` : undefined}
        />
      )
    case TxStage.COMPLETE:
      return (
        <Alert
          message={"Transaction successful"}
          type={"success"}
          showIcon
          description={txId ? `Transaction ID: ${txId}` : undefined}
        />
      )
    case TxStage.REVERTED:
      return (
        <Alert
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
