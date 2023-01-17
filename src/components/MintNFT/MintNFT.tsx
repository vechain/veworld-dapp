import {
  Button,
  Icon,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  VStack,
} from "@chakra-ui/react"
import { CurrencyDollarIcon } from "@heroicons/react/24/solid"
import React from "react"
import { RegisterOptions, useForm } from "react-hook-form"
import useMintNonFungibleToken from "../../hooks/useMintNonFungibleToken"
import { INonFungibleToken } from "../../model/State"
import { TxStage } from "../../model/Transaction"
import TransactionStatus from "../TransactionStatus/TransactionStatus"

interface IMintNFTForm {
  nft: INonFungibleToken
}
export type MintNFTForm = {
  address: string
}
const MintNFT: React.FC<IMintNFTForm> = ({ nft }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<MintNFTForm>({
    mode: "onTouched",
  })
  const { mintNonFungibleToken, txStatus, txId, error } =
    useMintNonFungibleToken()

  const comment =
    "NFT --- The concept of Pragmatic Programming has become a reference term to the Programmers who are looking to hone their skills. Pragmatic Programming has been designed through real case analysis based on practical market experience. We have established a set of principles and concepts throughout this book that understand the characteristics and responsibilities of a Pragmatic Programmer."

  const onSubmit = async (data: MintNFTForm) => {
    const mintResult = await mintNonFungibleToken(nft, data.address, comment)
    console.log(mintResult)
  }

  console.log(txStatus, error)
  const isTxPending = [TxStage.IN_EXTENSION, TxStage.POLLING_TX].includes(
    txStatus
  )

  const addressRules: RegisterOptions = {
    minLength: { value: 1, message: "Required" },
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} w="full">
        <FormControl isRequired isInvalid={!!errors.address?.message}>
          <FormLabel>Address</FormLabel>
          <Input type="text" {...register("address", addressRules)} />
          <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
        </FormControl>
      </VStack>
      <VStack w="full" mt={8} spacing={4}>
        <TransactionStatus txStage={txStatus} txId={txId} error={error} />
        <Button
          w="full"
          disabled={isTxPending}
          type="submit"
          colorScheme="blue"
          leftIcon={
            isTxPending ? <Spinner /> : <Icon as={CurrencyDollarIcon} />
          }
        >
          {isTxPending ? "Minting..." : "Mint NFT"}
        </Button>
      </VStack>
    </form>
  )
}

export default MintNFT
