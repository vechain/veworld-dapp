import { Button, Icon, useDisclosure } from "@chakra-ui/react"
import { WalletIcon } from "@heroicons/react/24/solid"
import { useWallet } from "../../context/walletContext"
import { humanAddress } from "../../utils/FormattingUtils"
import AccountDetailModal from "../AccountDetailModal/AccountDetailModal"
import ConnectWalletModal from "../ConnectWalletModal/ConnectWalletModal"

const ConnectWalletButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    state: { account },
  } = useWallet()

  if (account)
    return (
      <>
        <AccountDetailModal
          isOpen={isOpen}
          onClose={onClose}
          account={account}
        />
        <Button
          colorScheme={"blue"}
          onClick={onOpen}
          flex={1}
          leftIcon={<Icon as={WalletIcon} />}
        >
          {humanAddress(account.address)}
        </Button>
      </>
    )

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
