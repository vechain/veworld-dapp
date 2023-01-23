import { Button, HTMLChakraProps, Icon, useDisclosure } from "@chakra-ui/react"
import { WalletIcon } from "@heroicons/react/24/solid"
import React from "react"
import { useWallet } from "../../context/walletContext"
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
    state: { account, network },
  } = useWallet()

  if (account && network)
    return (
      <>
        <AccountDetailModal
          isOpen={isOpen}
          onClose={onClose}
          account={account}
          network={network}
        />
        <AddressButton
          {...buttonProps}
          address={account.address}
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
