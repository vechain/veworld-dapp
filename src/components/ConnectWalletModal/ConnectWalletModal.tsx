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
import React, { useCallback, useState } from "react"
import { ActionType, useWallet } from "../../context/WalletContext"
import { Network, WalletSource } from "../../model/enums"
import { getErrorMessage } from "../../utils/ExtensionUtils"
import { humanAddress } from "../../utils/FormattingUtils"
import AccountSourceRadio from "../Account/AccountSourceRadio/AccountSourceRadio"
import NetworkSelect from "../Network/NetworkSelect/NetworkSelect"
import { Dialog } from "../Shared"
import { Certificate } from "thor-devkit"
import { useConnex } from "../../context/ConnexContext"

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
  const {
    dispatch,
    state: { account, network },
  } = useWallet()
  const toast = useToast()
  const { vendor } = useConnex()

  const [connectionLoading, setConnectionLoading] = useState(false)
  const [connectionError, setConnectionError] = useState("")

  const onNetworkChange = useCallback(
    (_network: Network) =>
      dispatch({
        type: ActionType.SET_NETWORK,
        payload: _network,
      }),
    [dispatch]
  )

  const onSourceChange = useCallback(
    (source: WalletSource) =>
      dispatch({ type: ActionType.SET_ACCOUNT, payload: { source } }),
    [dispatch]
  )

  const connectToWalletHandler = async (): Promise<Certificate> => {
    const message: Connex.Vendor.CertMessage = {
      purpose: "identification",
      payload: {
        type: "text",
        content: "Sign a certificate to prove your identity",
      },
    }

    const certResponse = await vendor().sign("cert", message).request()

    const cert: Certificate = {
      purpose: message.purpose,
      payload: message.payload,
      domain: certResponse.annex.domain,
      timestamp: certResponse.annex.timestamp,
      signer: certResponse.annex.signer,
      signature: certResponse.signature,
    }

    if (!cert) throw new Error("No cert returned")

    console.log("Signed cert", cert)
    Certificate.verify(cert)
    console.log("Cert verified")

    return cert
  }

  const connectHandler = async () => {
    try {
      setConnectionError("")
      setConnectionLoading(true)

      const cert = await connectToWalletHandler()

      onSuccessfullConnection(cert)
    } catch (e: unknown) {
      const em = getErrorMessage(e)
      console.log(em)
      setConnectionError(em)
    } finally {
      setConnectionLoading(false)
    }
  }

  const onSuccessfullConnection = (cert: Certificate) => {
    dispatch({
      type: ActionType.SET_ACCOUNT,
      payload: {
        address: cert.signer,
        source: account.source,
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
  }

  return (
    <>
      <Flex direction={"column"} gap={8}>
        <Box>
          <Text mb="8px">Network</Text>
          <NetworkSelect selected={network} onChange={onNetworkChange} />
        </Box>
        <Box>
          <Text mb="8px">Wallet</Text>
          <AccountSourceRadio
            selected={account.source}
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
