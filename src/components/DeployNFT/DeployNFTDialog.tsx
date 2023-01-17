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
import { ActionType, useWallet } from "../../context/walletContext"
import useDeployNonFungibleToken from "../../hooks/useDeployNonFungibleToken"
import { IAccount } from "../../model/State"
import { TxStage } from "../../model/Transaction"
import { Dialog } from "../Shared"
import TransactionStatus from "../TransactionStatus/TransactionStatus"

interface IDeployNFTDialog {
  isOpen: boolean
  onClose: () => void
  account: IAccount
}

const DeployNFTDialog: React.FC<IDeployNFTDialog> = ({
  isOpen,
  onClose,
  account,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      header={"Deploy NFT"}
      body={<DeployNFTDialogBody account={account} />}
    />
  )
}

type DeployNFTForm = {
  name: string
  symbol: string
  baseTokenURI: string
  delegateUrl?: string
}
interface IDeployNFTDialogBody {
  account: IAccount
}
const DeployNFTDialogBody: React.FC<IDeployNFTDialogBody> = ({ account }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<DeployNFTForm>({
    mode: "onTouched",
  })
  const { deployNftContract, txStatus, txId, error } =
    useDeployNonFungibleToken()

  const { dispatch } = useWallet()

  const comment =
    "To become a Pragmatic Programmer, you need to think about what you are doing while you are doing it. It is not enough to do an isolated audit to get positive results, but to make it a habit to make a constant critical assessment of every decision you have made or intend to make. In other words, it is necessary to turn off the autopilot and to be present and aware of every action taken, to be constantly thinking and criticizing your work based on the Principles of Pragmatism.\n" +
    "\n"

  const onSubmit = async (data: DeployNFTForm) => {
    const deployedData = await deployNftContract(
      account.address,
      data.name,
      data.symbol,
      data.baseTokenURI,
      data.delegateUrl,
      comment
    )
    console.log(deployedData)
    if (deployedData && typeof deployedData !== "string")
      dispatch({ type: ActionType.ADD_NFT, payload: deployedData.nft })
  }

  const isTxPending = [TxStage.IN_EXTENSION, TxStage.POLLING_TX].includes(
    txStatus
  )

  const nameRules: RegisterOptions = {
    minLength: { value: 1, message: "Required" },
  }

  const symbolRules: RegisterOptions = {
    validate: (value: string) =>
      (value.length >= 3 && value.length <= 5) ||
      "Symbol must be 3 to 5 characters",
  }

  const baseTokenURIRules: RegisterOptions = {
    minLength: { value: 1, message: "Required" },
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
        <FormControl isRequired isInvalid={!!errors.baseTokenURI?.message}>
          <FormLabel>Base Token URI</FormLabel>
          <Input type="text" {...register("baseTokenURI", baseTokenURIRules)} />
          <FormErrorMessage>{errors.baseTokenURI?.message}</FormErrorMessage>
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

        <Button
          w="full"
          disabled={isTxPending}
          type="submit"
          colorScheme="blue"
          leftIcon={isTxPending ? <Spinner /> : <></>}
        >
          {isTxPending ? "Deploying..." : "Deploy NFT"}
        </Button>
      </VStack>
    </form>
  )
}

export default DeployNFTDialog
