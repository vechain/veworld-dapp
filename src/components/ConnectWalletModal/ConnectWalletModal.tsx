import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Flex,
  Box,
} from "@chakra-ui/react"
import React from "react"
import NetworkSwitcher from "../NetworkSwitcher/NetworkSwitcher"

interface IConnectWalletModal {
  isOpen: boolean
  onClose: () => void
}
const ConnectWalletModal: React.FC<IConnectWalletModal> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ConnectWalletModal
