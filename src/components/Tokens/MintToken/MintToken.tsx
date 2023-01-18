import {
  Button,
  Icon,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  VStack,
  FormHelperText,
  HStack,
} from "@chakra-ui/react"
import { ArrowPathIcon, ArrowSmallLeftIcon } from "@heroicons/react/24/solid"
import React from "react"
import { RegisterOptions, useForm } from "react-hook-form"
import useMintToken from "../../../hooks/useMintToken"
import { IToken } from "../../../model/State"
import { TxStage } from "../../../model/Transaction"
import TransactionStatus from "../../TransactionStatus/TransactionStatus"

interface IMintTokenForm {
  token: IToken
  navigateBack: () => void
}
export type MintTokenForm = {
  address: string
  amount: number
  clausesNumber: number
}
const MintToken: React.FC<IMintTokenForm> = ({ token, navigateBack }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<MintTokenForm>({
    mode: "onTouched",
  })
  const { mintToken, txStatus, txId, error } = useMintToken()

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
    minLength: { value: 1, message: "Required" },
  }

  const amountRules: RegisterOptions = {
    min: { value: 0, message: "Must be > 0" },
  }

  const clausesNumberRules: RegisterOptions = {}

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} w="full">
        <FormControl isRequired isInvalid={!!errors.address?.message}>
          <FormLabel>Address</FormLabel>
          <Input type="text" {...register("address", addressRules)} />
          <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.amount?.message}>
          <FormLabel>Amount</FormLabel>
          <Input type="number" {...register("amount", amountRules)} />
          <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.clausesNumber?.message}>
          <FormLabel>Number of clauses</FormLabel>
          <Input
            type="number"
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
            onClick={navigateBack}
            leftIcon={<Icon as={ArrowSmallLeftIcon} />}
          >
            Back
          </Button>

          <Button
            w="full"
            disabled={isTxPending}
            type="submit"
            colorScheme="blue"
            leftIcon={
              isTxPending ? (
                <Spinner />
              ) : !isFistMint ? (
                <Icon as={ArrowPathIcon} />
              ) : (
                <></>
              )
            }
          >
            {isTxPending ? "Minting..." : isFistMint ? "Mint" : "Mint again"}
          </Button>
        </HStack>
      </VStack>
    </form>
  )
}

export default MintToken
