import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Spinner,
  VStack,
} from "@chakra-ui/react"
import React from "react"
import { RegisterOptions, useForm } from "react-hook-form"
import useDeployToken from "../../hooks/useDeployToken"
import { IAccount } from "../../model/State"
import { TxStage } from "../../model/Transaction"
import { Dialog } from "../Shared"
import TransactionStatus from "../TransactionStatus/TransactionStatus"

interface IDeployTokenDialog {
  isOpen: boolean
  onClose: () => void
  account: IAccount
}

const DeployTokenDialog: React.FC<IDeployTokenDialog> = ({
  isOpen,
  onClose,
  account,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      header={"Deploy Token"}
      body={<DeployTokenDialogBody account={account} />}
    />
  )
}

type DeployTokenForm = {
  name: string
  symbol: string
  decimals: number
  delegateUrl?: string
}
interface IDeployTokenDialogBody {
  account: IAccount
}
const DeployTokenDialogBody: React.FC<IDeployTokenDialogBody> = ({
  account,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<DeployTokenForm>({
    mode: "onTouched",
  })
  const { deployToken, txStatus, txId, error } = useDeployToken()

  const comment =
    "To become a Pragmatic Programmer, you need to think about what you are doing while you are doing it. It is not enough to do an isolated audit to get positive results, but to make it a habit to make a constant critical assessment of every decision you have made or intend to make. In other words, it is necessary to turn off the autopilot and to be present and aware of every action taken, to be constantly thinking and criticizing your work based on the Principles of Pragmatism.\n" +
    "\n"

  const onSubmit = async (data: DeployTokenForm) => {
    const deployedData = await deployToken(
      account.address,
      data.name,
      data.symbol,
      data.decimals,
      data.delegateUrl,
      comment
    )
    console.log(deployedData)
  }

  console.log(txStatus, error)
  const isTxToInitialize = txStatus === TxStage.NONE
  const isTxPending = [TxStage.IN_EXTENSION, TxStage.POLLING_TX].includes(
    txStatus
  )

  const decimalsRules: RegisterOptions = {
    validate: (value) =>
      (value >= 0 && value <= 255) || "Value must be between 0 and 255",
  }

  const nameRules: RegisterOptions = {
    minLength: { value: 1, message: "Required" },
  }

  const symbolRules: RegisterOptions = {
    validate: (value: string) =>
      (value.length >= 3 && value.length <= 5) ||
      "Symbol must be 3 to 5 characters",
  }

  const delegateUrlRules: RegisterOptions = {
    validate: (value: string) => {
      if (!value) return true
      try {
        new URL(value)
        return true
      } catch (e) {
        return "Invalid URL"
      }
    },
  }

  if (isTxToInitialize)
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} w="full">
          <FormControl isRequired isInvalid={!!errors.name?.message}>
            <FormLabel>Name</FormLabel>
            <Input type="text" {...register("name", nameRules)} />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.symbol?.message}>
            <FormLabel>Symbol</FormLabel>
            <Input type="text" {...register("symbol", symbolRules)} />
            <FormErrorMessage>{errors.symbol?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.decimals?.message}>
            <FormLabel>Decimals</FormLabel>
            <Input type="number" {...register("decimals", decimalsRules)} />
            <FormErrorMessage>{errors.decimals?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.delegateUrl?.message}>
            <FormLabel>Delegate URL</FormLabel>
            <Input type="text" {...register("delegateUrl", delegateUrlRules)} />
            {errors.delegateUrl?.message ? (
              <FormErrorMessage>{errors.delegateUrl.message}</FormErrorMessage>
            ) : (
              <FormHelperText>
                Sample URL: https://sponsor-testnet.vechain.energy/by/147
              </FormHelperText>
            )}
          </FormControl>
        </VStack>
        <Button mt={8} w="full" type="submit" colorScheme="blue">
          Deploy token
        </Button>
      </form>
    )

  return (
    <VStack spacing={8}>
      {isTxPending && (
        <Spinner
          thickness="4px"
          speed="0.5s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      )}
      <TransactionStatus txStage={txStatus} txId={txId} error={error} />
    </VStack>
  )
}

export default DeployTokenDialog
