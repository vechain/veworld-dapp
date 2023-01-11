import { Button, Icon, useDisclosure } from "@chakra-ui/react"
import { WalletIcon } from "@heroicons/react/24/solid"
import ConnectWalletModal from "../ConnectWalletModal/ConnectWalletModal"

const ConnectWalletButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <ConnectWalletModal isOpen={isOpen} onClose={onClose} />
      <Button onClick={onOpen} flex={1} leftIcon={<Icon as={WalletIcon} />}>
        Connect Wallet
      </Button>
    </>
  )
}

export default ConnectWalletButton
