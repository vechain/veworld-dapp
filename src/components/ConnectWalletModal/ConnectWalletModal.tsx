import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { LinkIcon, WalletIcon } from "@heroicons/react/24/solid"
import React, { useState } from "react"
import { ActionType, useWallet } from "../../context/walletContext"
import {
  DEFAULT_NETWORK,
  DEFAULT_SOURCE,
  Network,
  WalletSource,
} from "../../model/enums"
import { connectToWalletHandler } from "../../service/ConnexService"
import { getErrorMessage } from "../../utils/ExtensionUtils"
import { humanAddress } from "../../utils/FormattingUtils"
import AccountSourceRadio from "../Account/AccountSourceRadio/AccountSourceRadio"
import NetworkSelect from "../Network/NetworkSelect/NetworkSelect"
import { Dialog } from "../Shared"

interface IConnectedWalletDialog {
  isOpen: boolean
  onClose: () => void
}

const ConnectedWalletDialog: React.FC<IConnectedWalletDialog> = ({
  isOpen,
  onClose,
}) => {
  const header = (
    <HStack spacing={2}>
      <Icon as={WalletIcon} />
      <Text>Connect Wallet</Text>
    </HStack>
  )

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      body={<ConnectedWalletBody onClose={onClose} />}
    />
  )
}

interface IConnectedWalletBody {
  onClose: () => void
}

const ConnectedWalletBody: React.FC<IConnectedWalletBody> = ({ onClose }) => {
  const { dispatch } = useWallet()
  const toast = useToast()

  const [connectionLoading, setConnectionLoading] = useState(false)
  const [connectionError, setConnectionError] = useState("")
  const [selectedNetwork, setSelectedNework] =
    useState<Network>(DEFAULT_NETWORK)
  const onNetworkChange = (network: Network) => setSelectedNework(network)

  const [selectedSource, setSelectedSource] =
    useState<WalletSource>(DEFAULT_SOURCE)
  const onSourceChange = (network: WalletSource) => setSelectedSource(network)

  const connectHandler = async () => {
    try {
      setConnectionError("")
      setConnectionLoading(true)
      const cert = await connectToWalletHandler(selectedSource, selectedNetwork)
      dispatch({
        type: ActionType.SET_ALL,
        payload: {
          network: selectedNetwork,
          account: { address: cert.signer, source: selectedSource },
        },
      })
      onClose()
      toast({
        title: "Wallet connected.",
        description: `You've succesfully connected with wallet ${humanAddress(
          cert.signer
        )}`,
        status: "success",
        position: "bottom-left",
        duration: 5000,
        isClosable: true,
      })
    } catch (e: unknown) {
      const em = getErrorMessage(e)
      console.log(em)
      setConnectionError(em)
    } finally {
      setConnectionLoading(false)
    }
  }

  return (
    <>
      <Flex direction={"column"} gap={8}>
        <Box>
          <Text mb="8px">Network</Text>
          <NetworkSelect
            selected={selectedNetwork}
            onChange={onNetworkChange}
          />
        </Box>
        <Box>
          <Text mb="8px">Wallet</Text>
          <AccountSourceRadio
            selected={selectedSource}
            onChange={onSourceChange}
          />
        </Box>
      </Flex>
      <VStack w="full" spacing={4} mt={8}>
        {connectionLoading && (
          <Alert status="warning">
            <AlertIcon />
            Waiting for wallet approval...
          </Alert>
        )}
        {connectionError && (
          <Alert status="error">
            <AlertIcon />
            {connectionError}
          </Alert>
        )}

        <Button
          w="full"
          disabled={connectionLoading}
          onClick={connectHandler}
          colorScheme="blue"
          leftIcon={connectionLoading ? <Spinner /> : <Icon as={LinkIcon} />}
        >
          {connectionLoading ? "Connecting..." : "Connect"}
        </Button>
      </VStack>
    </>
  )
}

export default ConnectedWalletDialog
