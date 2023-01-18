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
import { useWallet } from "../../../context/walletContext"
import useNFTBalance from "../../../hooks/useNFTBalance"
import { IAccount, INonFungibleToken } from "../../../model/State"
import AddressButton from "../../Account/Address/AddressButton"
import MintNFT from "../../MintNFT/MintNFT"
import NFTsSelect from "../NFTsSelect/NFTsSelect"
import { Dialog } from "../../Shared"

interface IDeployNFTDialog {
  isOpen: boolean
  onClose: () => void
  account: IAccount
}

const NFTsDialog: React.FC<IDeployNFTDialog> = ({ isOpen, onClose }) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      header={"Your NFTs"}
      body={<NFTsDialogBody />}
    />
  )
}

const NFTsDialogBody: React.FC = () => {
  const {
    state: { nfts },
  } = useWallet()

  const [selected, setSelected] = useState<INonFungibleToken>(nfts[0])

  const { onOpen: openMintView, isOpen: isMintView } = useDisclosure()

  const onNftChange = (nft: INonFungibleToken) => setSelected(nft)

  if (isMintView) return <MintNFT nft={selected} />
  return (
    <Flex gap={4} direction="column" w="full">
      <Box>
        <Text mb="8px">NFT</Text>
        <NFTsSelect nfts={nfts} selected={selected} onChange={onNftChange} />
      </Box>
      <Divider />
      {selected && <NFTDetails nft={selected} onMintClick={openMintView} />}
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
        <AddressButton address={nft.address} showAddressIcon={false} />
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

export default NFTsDialog
