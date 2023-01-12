import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react"
import React from "react"
import { useForm } from "react-hook-form"
import useDeployToken from "../../hooks/useDeployToken"
import { IAccount } from "../../model/State"
import { Dialog } from "../Shared"

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
  const { handleSubmit, register } = useForm<DeployTokenForm>()
  const { deployToken, txStatus, error } = useDeployToken()

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
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} w="full">
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input type="text" {...register("name", { required: true })} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Symbol</FormLabel>
          <Input type="text" {...register("symbol", { required: true })} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Decimals</FormLabel>
          <Input type="number" {...register("decimals", { required: true })} />
        </FormControl>
        <FormControl>
          <FormLabel>Delegate URL</FormLabel>
          <Input type="text" {...register("delegateUrl")} />
          <FormHelperText>
            Sample URL: https://sponsor-testnet.vechain.energy/by/147
          </FormHelperText>
        </FormControl>
      </VStack>
      <Button mt={8} w="full" type="submit" colorScheme="blue">
        Deploy token
      </Button>
    </form>
  )
}

export default DeployTokenDialog
