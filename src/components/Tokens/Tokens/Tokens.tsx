import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react"
import React, { useCallback, useEffect, useState } from "react"
import { useWallet } from "../../../context/walletContext"
import useTokenBalance from "../../../hooks/useTokenBalance"
import { IToken } from "../../../model/State"
import AddressButton from "../../Account/Address/AddressButton"
import TokensSelect from "../TokensSelect/TokensSelect"

interface ITokens {
  selectedToken?: IToken
  openMintView: (token: IToken) => void
}
const Tokens: React.FC<ITokens> = ({ selectedToken, openMintView }) => {
  const {
    state: { tokens },
  } = useWallet()

  console.log(selectedToken)

  const [selected, setSelected] = useState<IToken>(selectedToken || tokens[0])

  useEffect(() => {
    console.log(selected)
  }, [selected])

  const onTokenChange = useCallback((token: IToken) => setSelected(token), [])

  const onMintClick = useCallback(
    () => openMintView(selected),
    [openMintView, selected]
  )

  if (!tokens.length)
    return <Text fontSize="xl"> You have deployed no tokens </Text>

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
      {selected && <TokenDetails token={selected} onMintClick={onMintClick} />}
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
        <Text fontSize={"md"}>
          {`${balance} ${token.symbol}` || "Not available"}
        </Text>
      </HStack>
      <Button onClick={onMintClick} colorScheme={"blue"} w="full">
        Mint
      </Button>
    </VStack>
  )
}

export default Tokens
