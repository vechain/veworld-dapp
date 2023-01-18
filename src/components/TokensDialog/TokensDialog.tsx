import {
  Button,
  VStack,
  HStack,
  Box,
  Flex,
  Text,
  Divider,
  useDisclosure,
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useWallet } from "../../context/walletContext"
import useTokenBalance from "../../hooks/useTokenBalance"
import { IAccount, IToken } from "../../model/State"
import AddressButton from "../Account/Address/AddressButton"
import MintToken from "../MintToken/MintToken"
import { Dialog } from "../Shared"
import TokensSelect from "../TokensSelect/TokensSelect"

interface IDeployTokenDialog {
  isOpen: boolean
  onClose: () => void
  account: IAccount
}

const TokensDialog: React.FC<IDeployTokenDialog> = ({ isOpen, onClose }) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      header={"Your tokens"}
      body={<TokensDialogBody />}
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
      <Box>
        <Text mb="8px">Token</Text>
        <TokensSelect
          tokens={tokens}
          selected={selected}
          onChange={onTokenChange}
        />
      </Box>
      <Divider />
      {selected && <TokenDetails token={selected} onMintClick={openMintView} />}
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
