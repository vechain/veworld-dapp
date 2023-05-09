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
import useNFTBalance from "../../../hooks/useNFTBalance"
import { INonFungibleToken } from "../../../model/State"
import AddressButton from "../../Account/Address/AddressButton"
import EmptyState from "../../Icons/EmptyState"
import NFTsSelect from "../NFTsSelect/NFTsSelect"

interface ITokens {
  selectedNft?: INonFungibleToken
  openMintView: (token: INonFungibleToken) => void
}

const NFTs: React.FC<ITokens> = ({ selectedNft, openMintView }) => {
  const {
    state: { nfts },
  } = useWallet()

  const [selected, setSelected] = useState<INonFungibleToken>(
    selectedNft || nfts[0]
  )

  useEffect(() => {
    console.log(selected)
  }, [selected])

  const onNftChange = useCallback(
    (token: INonFungibleToken) => setSelected(token),
    []
  )

  const onMintClick = useCallback(
    () => openMintView(selected),
    [openMintView, selected]
  )

  if (!nfts.length)
    return <EmptyState description="You have no deployed NFTs " />
  // return <Text fontSize="xl"> You have deployed no tokens </Text>

  return (
    <Flex gap={4} direction="column" w="full">
      <Box>
        <Text mb="8px">Token</Text>
        <NFTsSelect nfts={nfts} selected={selected} onChange={onNftChange} />
      </Box>
      <Divider />
      {selected && <NFTDetails nft={selected} onMintClick={onMintClick} />}
    </Flex>
  )
}

interface INftsDetails {
  nft: INonFungibleToken
  onMintClick: () => void
}

const NFTDetails: React.FC<INftsDetails> = ({ nft, onMintClick }) => {
  const {
    state: { account },
  } = useWallet()
  const { balance, getNFTBalance } = useNFTBalance()

  useEffect(() => {
    if (account) getNFTBalance(nft, account.address)
  }, [account, nft])

  return (
    <VStack spacing={4}>
      <HStack justify={"space-between"} w="full">
        <Text as="b" fontSize={"lg"}>
          Address
        </Text>
        <AddressButton
          id={"nft-contract-address"}
          address={nft.address}
          showAddressIcon={false}
        />
      </HStack>
      <HStack justify={"space-between"} w="full">
        <Text as="b" fontSize={"lg"}>
          Name
        </Text>
        <Text fontSize={"md"}>{nft.name}</Text>
      </HStack>
      <HStack justify={"space-between"} w="full">
        <Text as="b" fontSize={"lg"}>
          Symbol
        </Text>
        <Text fontSize={"md"}>{nft.symbol}</Text>
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

export default NFTs
