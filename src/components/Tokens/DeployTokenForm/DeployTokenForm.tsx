import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Spinner,
  VStack,
  Icon,
} from "@chakra-ui/react"
import { ArrowPathIcon, ArrowSmallLeftIcon } from "@heroicons/react/24/solid"
import React from "react"
import { RegisterOptions, useForm } from "react-hook-form"
import { ActionType, useWallet } from "../../../context/walletContext"
import useDeployToken from "../../../hooks/useDeployToken"
import { IAccount } from "../../../model/State"
import { TxStage } from "../../../model/Transaction"
import TransactionStatus from "../../TransactionStatus/TransactionStatus"

type DeployTokenForm = {
  name: string
  symbol: string
  decimals: number
  delegateUrl?: string
}
interface IDeployTokenDialogBody {
  account: IAccount
  goToYourTokens: () => void
}
const DeployTokenForm: React.FC<IDeployTokenDialogBody> = ({
  account,
  goToYourTokens,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<DeployTokenForm>({
    mode: "onTouched",
  })
  const { deployToken, txStatus, txId, error } = useDeployToken()

  const isFirstDeploy = !txId

  const { dispatch } = useWallet()

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
    if (deployedData && typeof deployedData !== "string")
      dispatch({ type: ActionType.ADD_TOKEN, payload: deployedData.token })
  }

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
      <VStack mt={8} spacing={4}>
        <TransactionStatus txStage={txStatus} txId={txId} error={error} />

        <HStack spacing={4} w="full">
          <Button
            w="full"
            variant={"outline"}
            colorScheme="blue"
            onClick={goToYourTokens}
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
              ) : !isFirstDeploy ? (
                <Icon as={ArrowPathIcon} />
              ) : (
                <></>
              )
            }
          >
            {isTxPending
              ? "Deploying..."
              : !isFirstDeploy
              ? "Deploy again"
              : "Deploy"}
          </Button>
        </HStack>
      </VStack>
    </form>
  )
}

export default DeployTokenForm
