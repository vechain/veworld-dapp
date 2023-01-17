import {
  Button,
  Icon,
  Heading,
  HStack,
  Text,
  VStack,
  Box,
  Flex,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import React from "react"
import { useWallet } from "../../../context/walletContext"
import { CurrencyDollarIcon, WalletIcon } from "@heroicons/react/24/solid"
import StyledCard from "../../Shared/StyledCard/StyledCard"
import DeployTokenDialog from "../../DeployToken/DeployTokenDialog"
import { IAccount } from "../../../model/State"
import TokensDialog from "../../TokensDialog/TokensDialog"
import DeployNFTDialog from "../../DeployNFT/DeployNFTDialog"
import NFTsDialog from "../../NFTsDialog/NFTsDialog"

interface IFeatureDialog {
  isOpen: boolean
  onClose: () => void
  account: IAccount
}
interface IFeature {
  name: string
  desc: string
  requireWallet: boolean
  icon?: React.ReactNode
  featureDialog: React.FC<IFeatureDialog>
}
const FeatureList: IFeature[] = [
  {
    name: "Deploy a token",
    desc: "Create a new token on VeChain in seconds!",
    icon: <CurrencyDollarIcon />,
    requireWallet: true,
    featureDialog: DeployTokenDialog,
  },
  {
    name: "Your tokens",
    desc: "See and mint the tokens deployed from this dapp",
    icon: <CurrencyDollarIcon />,
    requireWallet: true,
    featureDialog: TokensDialog,
  },
  {
    name: "Deploy an NFT",
    desc: "Create a new NFT contract on VeChain in seconds!",
    icon: <CurrencyDollarIcon />,
    requireWallet: true,
    featureDialog: DeployNFTDialog,
  },
  {
    name: "Your NFTs",
    desc: "See and mint NFTs deployed from this dapp",
    icon: <CurrencyDollarIcon />,
    requireWallet: true,
    featureDialog: NFTsDialog,
  },
]

const Features: React.FC = () => {
  return (
    <VStack spacing={4} align="flex-start">
      <Heading> Features </Heading>
      <HStack spacing={4} w={"full"}>
        {FeatureList.map((feature) => {
          return <FeatureCard key={feature.name} feature={feature} />
        })}
      </HStack>
    </VStack>
  )
}

interface IFeatureCard {
  feature: IFeature
}
const FeatureCard: React.FC<IFeatureCard> = ({ feature }) => {
  const {
    state: { account, network },
  } = useWallet()

  const { isOpen, onClose, onOpen } = useDisclosure()
  const isDisabled = feature.requireWallet && (!account || !network)

  return (
    <Box position={"relative"}>
      {account && (
        <feature.featureDialog
          isOpen={isOpen}
          onClose={onClose}
          account={account}
        />
      )}
      {isDisabled && (
        <Tooltip label="Connect your wallet first" placement="top">
          <Flex
            position={"absolute"}
            right={-2}
            zIndex={10}
            top={-2}
            p={2}
            rounded="full"
            bg="orange.500"
            alignItems={"center"}
          >
            <Icon color={"white"} fontSize={"xl"} as={WalletIcon} />
          </Flex>
        </Tooltip>
      )}
      <StyledCard>
        <VStack spacing={2} align="flex-start">
          <Heading fontSize={"2xl"}>{feature.name}</Heading>
          <Text fontSize={"md"}>{feature.desc}</Text>
          <Button
            onClick={onOpen}
            disabled={isDisabled}
            colorScheme={"blue"}
            variant="outline"
          >
            Get started
          </Button>
        </VStack>
      </StyledCard>
    </Box>
  )
}

export default Features
