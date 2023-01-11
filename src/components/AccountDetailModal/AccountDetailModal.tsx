import { Button, Icon, HStack, Text, VStack } from "@chakra-ui/react"
import { WalletIcon } from "@heroicons/react/24/solid"
import React from "react"
import { ActionType, useWallet } from "../../context/walletContext"
import { IAccount } from "../../model/State"
import Address from "../Account/Address/Address"
import { Dialog } from "../Shared"

interface IConnectWalletModal {
  isOpen: boolean
  onClose: () => void
  account: IAccount
}
const AccountDetailModal: React.FC<IConnectWalletModal> = ({
  isOpen,
  onClose,
  account,
}) => {
  const { dispatch } = useWallet()

  const disconnectWallet = () => {
    dispatch({ type: ActionType.CLEAR })
    onClose()
  }

  const header = (
    <HStack spacing={2}>
      <Icon as={WalletIcon} />
      <Text>Connected Wallet</Text>
    </HStack>
  )

  if (!account) return <></>
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      body={
        <AccountDetailBody
          account={account}
          disconnectWallet={disconnectWallet}
        />
      }
    />
  )
}

interface IAccountDetailBody {
  account: IAccount
  disconnectWallet: () => void
}
const AccountDetailBody: React.FC<IAccountDetailBody> = ({
  account,
  disconnectWallet,
}) => {
  return (
    <VStack spacing={4} w="100%">
      <HStack justifyContent={"space-between"} w="full">
        <Text as="b" fontSize="md">
          Account
        </Text>
        <Address address={account.address} />
      </HStack>
      <HStack justifyContent={"space-between"} w="full">
        <Text as="b" fontSize="md">
          Source
        </Text>
        <Text>{account.source}</Text>
      </HStack>
      <Button onClick={disconnectWallet} w="full" colorScheme={"red"}>
        Disconnect
      </Button>
    </VStack>
  )
}

export default AccountDetailModal
