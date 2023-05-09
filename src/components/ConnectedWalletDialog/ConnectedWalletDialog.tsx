import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react"
import React from "react"
import { ActionType, useWallet } from "../../context/walletContext"
import { Network, WalletSourceInfo } from "../../model/enums"
import { IAccount } from "../../model/State"
import { getPicassoImgSrc } from "../../utils/PicassoUtils"
import AddressButton from "../Account/Address/AddressButton"
import NetworkBadge from "../Network/NetworkBadge/NetworkBadge"
import { Dialog } from "../Shared"

interface IConnectWalletModal {
  isOpen: boolean
  onClose: () => void
  account: IAccount
  network: Network
}

const AccountDetailModal: React.FC<IConnectWalletModal> = ({
  isOpen,
  onClose,
  account,
  network,
}) => {
  const { dispatch } = useWallet()

  const disconnectWallet = () => {
    dispatch({ type: ActionType.CLEAR })
    onClose()
  }

  const header = (
    <HStack
      spacing={2}
      p={4}
      bgImage={`url(${getPicassoImgSrc(account.address, true)})`}
      bgRepeat={"no-repeat"}
      bgSize="cover"
    >
      <Text color={"white"}>Connected Wallet</Text>
    </HStack>
  )

  if (!account) return <></>
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      headerStyle={{ p: 0 }}
      closeButtonStyle={{ color: "white" }}
      body={
        <AccountDetailBody
          account={account}
          network={network}
          disconnectWallet={disconnectWallet}
        />
      }
    />
  )
}

interface IAccountDetailBody {
  account: IAccount
  network: Network
  disconnectWallet: () => void
}

export const AccountDetailBody: React.FC<IAccountDetailBody> = ({
  account,
  network,
  disconnectWallet,
}) => {
  const sourceInfo = WalletSourceInfo[account.source]
  return (
    <>
      <VStack spacing={4} w="100%">
        <HStack justifyContent={"space-between"} w="full">
          <Text as="b" fontSize="md">
            Account
          </Text>
          <AddressButton
            id={"selected-account-address"}
            address={account.address}
          />
        </HStack>
        <HStack justifyContent={"space-between"} w="full">
          <Text as="b" fontSize="md">
            Source
          </Text>
          <HStack spacing={2}>
            <Image
              objectFit={"cover"}
              w={35}
              h={35}
              alt={`${sourceInfo.name}-logo`}
              src={sourceInfo.logo}
            />
            <Text>{sourceInfo.name}</Text>
          </HStack>
        </HStack>
        <HStack justifyContent={"space-between"} w="full">
          <Text as="b" fontSize="md">
            Network
          </Text>
          <NetworkBadge network={network} />
        </HStack>
      </VStack>
      <Button mt={8} onClick={disconnectWallet} w="full" colorScheme={"red"}>
        Disconnect
      </Button>
    </>
  )
}

export default AccountDetailModal
