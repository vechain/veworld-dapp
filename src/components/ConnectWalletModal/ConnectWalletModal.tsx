import { Box, Button, Flex, Text } from "@chakra-ui/react"
import React from "react"
import NetworkSwitcher from "../NetworkSwitcher/NetworkSwitcher"
import { Dialog } from "../Shared"

interface IConnectWalletModal {
  isOpen: boolean
  onClose: () => void
}
const ConnectWalletModal: React.FC<IConnectWalletModal> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      header={"Connect Wallet"}
      body={<ConnectWalletBody />}
    />
  )
}

const ConnectWalletBody: React.FC = () => {
  return (
    <Flex direction={"column"} gap={8}>
      <Box>
        <Text mb="8px">Network</Text>
        <NetworkSwitcher />
      </Box>
      <Box>
        <Text mb="8px">Wallet</Text>
        <NetworkSwitcher />
      </Box>
      <Button colorScheme={"blue"}>Connect</Button>
    </Flex>
  )
}

export default ConnectWalletModal
