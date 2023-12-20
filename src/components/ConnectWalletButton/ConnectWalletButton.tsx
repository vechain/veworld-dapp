import { Button, HTMLChakraProps, Icon, useDisclosure } from "@chakra-ui/react"
import { WalletIcon } from "@heroicons/react/24/solid"
import { useWallet } from "@vechain/dapp-kit-react"
import React from "react"
import { useAppState } from "../../context/WalletContext"
import AddressButton from "../Account/Address/AddressButton"
import AccountDetailModal from "../ConnectedWalletDialog/ConnectedWalletDialog"
import ConnectWalletModal from "../ConnectWalletModal/ConnectWalletModal"

interface IConnectWalletButton {
  buttonProps?: HTMLChakraProps<"button">
}

const ConnectWalletButton: React.FC<IConnectWalletButton> = ({
  buttonProps,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    state: { network },
  } = useAppState()

  const { account } = useWallet()

  if (account && network)
    return (
      <>
        <AccountDetailModal
          isOpen={isOpen}
          onClose={onClose}
          network={network}
        />
        <AddressButton
          {...buttonProps}
          address={account}
          showCopyIcon={false}
          onClick={onOpen}
        />
      </>
    )

  return (
    <>
      <ConnectWalletModal isOpen={isOpen} onClose={onClose} />
      <Button
        {...buttonProps}
        onClick={onOpen}
        leftIcon={<Icon as={WalletIcon} />}
      >
        Connect Wallet
      </Button>
    </>
  )
}

export default ConnectWalletButton
