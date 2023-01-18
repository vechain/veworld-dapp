import {
  Button,
  VStack,
  HStack,
  Box,
  Flex,
  Text,
  Divider,
  Icon,
  useDisclosure,
} from "@chakra-ui/react"
import { ArrowSmallLeftIcon } from "@heroicons/react/24/solid"
import React, { useEffect, useMemo, useState } from "react"
import { useWallet } from "../../../context/walletContext"
import useTokenBalance from "../../../hooks/useTokenBalance"
import { IAccount, IToken } from "../../../model/State"
import AddressButton from "../../Account/Address/AddressButton"
import MintToken from "../../MintToken/MintToken"
import { Dialog } from "../../Shared"
import DeployTokenForm from "../DeployTokenForm/DeployTokenForm"
import TokensSelect from "../TokensSelect/TokensSelect"

interface IDeployTokenDialog {
  isOpen: boolean
  onClose: () => void
  account: IAccount
}

const TokensDialog: React.FC<IDeployTokenDialog> = ({ isOpen, onClose }) => {
  const { isOpen: isDeployToken, onToggle: toggleDeployToken } = useDisclosure()
  const {
    state: { tokens, account },
  } = useWallet()

  const header = useMemo(
    () => (
      <HStack w="full" justify={"space-between"}>
        <Text>{isDeployToken ? "Deploy new token" : "Your tokens"}</Text>
        <Button
          {...(isDeployToken && { leftIcon: <Icon as={ArrowSmallLeftIcon} /> })}
          onClick={toggleDeployToken}
          colorScheme={"blue"}
          size="sm"
          variant={isDeployToken ? "outline" : "solid"}
        >
          {!isDeployToken ? "Deploy new token" : "Back"}
        </Button>
      </HStack>
    ),
    [toggleDeployToken, isDeployToken]
  )
  return (
    <Dialog
      isOpen={isOpen}
      showCloseButton={false}
      onClose={onClose}
      header={header}
      body={
        isDeployToken && account ? (
          <DeployTokenForm
            account={account}
            goToYourTokens={toggleDeployToken}
          />
        ) : (
          <TokensDialogBody />
        )
      }
    />
  )
}

const TokensDialogBody: React.FC = () => {
  const {
    state: { tokens },
  } = useWallet()

  const [selected, setSelected] = useState<IToken>(tokens[0])

  const { onOpen: openMintView, isOpen: isMintView } = useDisclosure()

  const onTokenChange = (token: IToken) => setSelected(token)

  if (isMintView) return <MintToken token={selected} />
  return (
    <Flex gap={4} direction="column" w="full">
      {tokens.length ? (
        <>
          <Box>
            <Text mb="8px">Token</Text>
            <TokensSelect
              tokens={tokens}
              selected={selected}
              onChange={onTokenChange}
            />
          </Box>
          <Divider />
          {selected && (
            <TokenDetails token={selected} onMintClick={openMintView} />
          )}
        </>
      ) : (
        <Text fontSize="xl"> You have deployed no tokens </Text>
      )}
    </Flex>
  )
}

interface ITokenDetails {
  token: IToken
  onMintClick: () => void
}
const TokenDetails: React.FC<ITokenDetails> = ({ token, onMintClick }) => {
  const {
    state: { account },
  } = useWallet()
  const { balance, getBalance } = useTokenBalance()

  useEffect(() => {
    if (account) getBalance(token, account.address)
  }, [account, token])

  return (
    <VStack spacing={4}>
      <HStack justify={"space-between"} w="full">
        <Text as="b" fontSize={"lg"}>
          Contract address
        </Text>
        <AddressButton address={token.address} showAddressIcon={false} />
      </HStack>
      <HStack justify={"space-between"} w="full">
        <Text as="b" fontSize={"lg"}>
          Name
        </Text>
        <Text fontSize={"md"}>{token.name}</Text>
      </HStack>
      <HStack justify={"space-between"} w="full">
        <Text as="b" fontSize={"lg"}>
          Symbol
        </Text>
        <Text fontSize={"md"}>{token.symbol}</Text>
      </HStack>
      <HStack justify={"space-between"} w="full">
        <Text as="b" fontSize={"lg"}>
          Decimals
        </Text>
        <Text fontSize={"md"}>{token.decimals}</Text>
      </HStack>
      <Divider />
      <HStack justify={"space-between"} w="full">
        <Text as="b" fontSize={"lg"}>
          Your balance
        </Text>
        <Text fontSize={"md"}>{balance || "Not available"}</Text>
      </HStack>
      <Button onClick={onMintClick} colorScheme={"blue"} w="full">
        Mint
      </Button>
    </VStack>
  )
}

export default TokensDialog
