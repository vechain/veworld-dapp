import { Button, Icon, useDisclosure } from "@chakra-ui/react"
import { WalletIcon } from "@heroicons/react/24/solid"
import { useWallet } from "../../context/walletContext"
import AddressButton from "../Account/Address/AddressButton"
import AccountDetailModal from "../ConnectedWalletDialog/ConnectedWalletDialog"
import ConnectWalletModal from "../ConnectWalletModal/ConnectWalletModal"

const ConnectWalletButton = () => {
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
          address={account.address}
          showCopyIcon={false}
          onClick={onOpen}
        />
      </>
    )

  return (
    <>
      <ConnectWalletModal isOpen={isOpen} onClose={onClose} />
      <Button onClick={onOpen} leftIcon={<Icon as={WalletIcon} />}>
        Connect Wallet
      </Button>
    </>
  )
}

export default ConnectWalletButton
