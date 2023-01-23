import { Text } from "@chakra-ui/react"
import React from "react"
import { useParams } from "react-router-dom"

const TxCallback: React.FC = () => {
  const { txid } = useParams()
  return <Text>Need to configure TX Callbacks. TX: {txid}</Text>
}

export default TxCallback
