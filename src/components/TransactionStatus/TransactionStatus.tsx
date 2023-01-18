import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  HStack,
  Text,
} from "@chakra-ui/react"
import React, { useCallback } from "react"
import { TxStage } from "../../model/Transaction"
import AddressButton from "../Account/Address/AddressButton"

interface TransactionStatusProps {
  setTxStage?: (txStage: TxStage) => void
  txStage: TxStage
  error?: string
  txId?: string
  componentName?: string
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({
  txStage,
  txId,
  error,
}) => {
  const getDescription = useCallback(() => {
    if (error) return error
    if (txId)
      return (
        <HStack spacing={2}>
          <Text>Transaction ID: </Text>
          <AddressButton address={txId} showAddressIcon={false} />
        </HStack>
      )
  }, [error, txId])

  switch (txStage) {
    case TxStage.NONE:
      return <></>
    case TxStage.IN_EXTENSION:
      return (
        <Alert status={"warning"}>
          <AlertIcon />
          <Box>
            <AlertTitle>Waiting for confirmation in extension!</AlertTitle>
            <AlertDescription>{getDescription()}</AlertDescription>
          </Box>
        </Alert>
      )
    case TxStage.POLLING_TX:
      return (
        <Alert status={"warning"}>
          <AlertIcon />
          <Box>
            <AlertTitle>Polling the blockchain for the transaction</AlertTitle>
            <AlertDescription>{getDescription()}</AlertDescription>
          </Box>
        </Alert>
      )
    case TxStage.FAILURE:
      return (
        <Alert status={"error"}>
          <AlertIcon />
          <Box>
            <AlertTitle>Transaction failed</AlertTitle>
            <AlertDescription>{getDescription()}</AlertDescription>
          </Box>
        </Alert>
      )
    case TxStage.COMPLETE:
      return (
        <Alert status={"success"}>
          <AlertIcon />
          <Box>
            <AlertTitle>Transaction successful</AlertTitle>
            <AlertDescription>{getDescription()}</AlertDescription>
          </Box>
        </Alert>
      )
    case TxStage.REVERTED:
      return (
        <Alert status={"error"}>
          <AlertIcon />
          <Box>
            <AlertTitle>Transaction reverted</AlertTitle>
            <AlertDescription>{getDescription()}</AlertDescription>
          </Box>
        </Alert>
      )
    default:
      return <></>
  }
}

export default TransactionStatus
