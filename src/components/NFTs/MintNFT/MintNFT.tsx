import {
  Button,
  Icon,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  VStack,
  HStack,
} from "@chakra-ui/react"
import { ArrowPathIcon, ArrowSmallLeftIcon } from "@heroicons/react/24/solid"
import React, { useCallback } from "react"
import { RegisterOptions, useForm } from "react-hook-form"
import useMintNonFungibleToken from "../../../hooks/useMintNonFungibleToken"
import { INonFungibleToken } from "../../../model/State"
import { TxStage } from "../../../model/Transaction"
import { isValid } from "../../../utils/AddressUtils"
import TransactionStatus from "../../TransactionStatus/TransactionStatus"

interface IMintNFTForm {
  nft: INonFungibleToken
  navigateBack: (token?: INonFungibleToken) => void
}
export type MintNFTForm = {
  address: string
}
const MintNFT: React.FC<IMintNFTForm> = ({ nft, navigateBack }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<MintNFTForm>({
    mode: "onTouched",
  })
  const { mintNonFungibleToken, txStatus, txId, error } =
    useMintNonFungibleToken()

  const onBackClick = useCallback(() => navigateBack(nft), [nft, navigateBack])

  const isFistMint = !txId

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
    validate: (value: string) => isValid(value) || "Address is not valid",
  }

  const getSubmitButtonLeftIcon = useCallback(() => {
    if (isTxPending) return <Spinner />
    if (!isFistMint) return <Icon as={ArrowPathIcon} />
    return <></>
  }, [isTxPending, isFistMint])

  const getSubmitButtonText = useCallback(() => {
    if (isTxPending) return "Minting..."
    if (!isFistMint) return "Mint again"
    return "Mint"
  }, [isTxPending, isFistMint])

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
        <HStack spacing={4} w="full">
          <Button
            w="full"
            variant={"outline"}
            colorScheme="blue"
            onClick={onBackClick}
            leftIcon={<Icon as={ArrowSmallLeftIcon} />}
          >
            Back
          </Button>

          <Button
            w="full"
            disabled={isTxPending}
            type="submit"
            colorScheme="blue"
            leftIcon={getSubmitButtonLeftIcon()}
          >
            {getSubmitButtonText()}
          </Button>
        </HStack>
      </VStack>
    </form>
  )
}

export default MintNFT
