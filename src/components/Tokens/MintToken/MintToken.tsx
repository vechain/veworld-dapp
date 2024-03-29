import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  Spinner,
  VStack,
} from "@chakra-ui/react"
import { ArrowPathIcon, ArrowSmallLeftIcon } from "@heroicons/react/24/solid"
import React, { useCallback } from "react"
import { RegisterOptions, useForm } from "react-hook-form"
import useMintToken from "../../../hooks/useMintToken"
import { IToken } from "../../../model/State"
import { TxStage } from "../../../model/Transaction"
import { isValid } from "../../../utils/AddressUtils"
import TransactionStatus from "../../TransactionStatus/TransactionStatus"

interface IMintToken {
  token: IToken
  navigateBack: (token?: IToken) => void
}

export type MintTokenForm = {
  address: string
  amount: number
  clausesNumber: number
}
const MintToken: React.FC<IMintToken> = ({ token, navigateBack }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<MintTokenForm>({
    mode: "onTouched",
  })
  const { mintToken, txStatus, txId, error } = useMintToken()

  const onBackClick = useCallback(
    () => navigateBack(token),
    [token, navigateBack]
  )

  const isFistMint = !txId

  const comment =
    "The concept of Pragmatic Programming has become a reference term to the Programmers who are looking to hone their skills. Pragmatic Programming has been designed through real case analysis based on practical market experience. We have established a set of principles and concepts throughout this book that understand the characteristics and responsibilities of a Pragmatic Programmer."

  const onSubmit = async (data: MintTokenForm) => {
    const mintResult = await mintToken(token, data, comment)
    console.log(mintResult)
  }

  console.log(txStatus, error)
  const isTxPending = [TxStage.IN_EXTENSION, TxStage.POLLING_TX].includes(
    txStatus
  )

  const addressRules: RegisterOptions = {
    validate: (value: string) => isValid(value) || "Address is not valid",
  }

  const amountRules: RegisterOptions = {
    min: { value: 0, message: "Must be > 0" },
  }

  const clausesNumberRules: RegisterOptions = {
    min: { value: 0, message: "Must be > 0" },
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
          <Input
            defaultValue={"0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa"}
            type="text"
            {...register("address", addressRules)}
          />
          <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.amount?.message}>
          <FormLabel>Amount</FormLabel>
          <Input
            defaultValue={100}
            type="number"
            {...register("amount", amountRules)}
          />
          <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.clausesNumber?.message}>
          <FormLabel>Number of clauses</FormLabel>
          <Input
            type="number"
            defaultValue={"10"}
            {...register("clausesNumber", clausesNumberRules)}
          />
          <FormHelperText>
            For testing purposes. The number of clauses of the transaction
          </FormHelperText>
          <FormErrorMessage>{errors.clausesNumber?.message}</FormErrorMessage>
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

export default MintToken
