import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react"
import { useWallet } from "@vechain/dapp-kit-react"
import React, { useEffect } from "react"
import { ActionType, useAppState } from "../../context/WalletContext"
import { Network, WalletSourceInfo } from "../../model/enums"
import { getPicassoImgSrc } from "../../utils/PicassoUtils"
import AddressButton from "../Account/Address/AddressButton"
import NetworkBadge from "../Network/NetworkBadge/NetworkBadge"
import { Dialog } from "../Shared"
import { WalletSource } from "@vechain/dapp-kit"

interface IConnectWalletModal {
  isOpen: boolean
  onClose: () => void
  network: Network
}

const AccountDetailModal: React.FC<IConnectWalletModal> = ({
  isOpen,
  onClose,
  network,
}) => {
  const { dispatch } = useAppState()
  const { source, disconnect, account } = useWallet()

  useEffect(() => {
    console.log({
      source,
      account,
    })
  }, [source, account])

  const disconnectWallet = () => {
    disconnect()
    dispatch({ type: ActionType.CLEAR })
    onClose()
  }

  if (!account || !source) return <></>

  const header = (
    <HStack
      spacing={2}
      p={4}
      bgImage={`url(${getPicassoImgSrc(account, true)})`}
      bgRepeat={"no-repeat"}
      bgSize="cover"
    >
      <Text color={"white"}>Connected Wallet</Text>
    </HStack>
  )

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      headerStyle={{ p: 0 }}
      closeButtonStyle={{ color: "white" }}
      body={
        <AccountDetailBody
          accountSource={source}
          accountAddress={account}
          network={network}
          disconnectWallet={disconnectWallet}
        />
      }
    />
  )
}

interface IAccountDetailBody {
  accountAddress: string
  accountSource: WalletSource
  network: Network
  disconnectWallet: () => void
}

export const AccountDetailBody: React.FC<IAccountDetailBody> = ({
  accountAddress,
  accountSource,
  network,
  disconnectWallet,
}) => {
  const sourceInfo = WalletSourceInfo[accountSource]
  return (
    <>
      <VStack spacing={4} w="100%">
        <HStack justifyContent={"space-between"} w="full">
          <Text as="b" fontSize="md">
            Account
          </Text>
          <AddressButton address={accountAddress} />
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
