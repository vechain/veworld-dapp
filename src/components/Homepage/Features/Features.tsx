import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import React from "react"
import { useWallet } from "../../../context/walletContext"
import { CurrencyDollarIcon, WalletIcon } from "@heroicons/react/24/solid"
import StyledCard from "../../Shared/StyledCard/StyledCard"
import { IAccount } from "../../../model/State"
import TokensDialog from "../../Tokens/TokensDialog/TokensDialog"
import NFTsDialog from "../../NFTs/NFTsDialog/NFTsDialog"

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
    name: "VIP180 tokens",
    desc: "See, deploy and mint VIP180 tokens aka fungible tokens! Create a token is never been so easy",
    icon: <CurrencyDollarIcon />,
    requireWallet: true,
    featureDialog: TokensDialog,
  },
  {
    name: "VIP181 tokens",
    desc: "See, deploy and mint VIP181 tokens aka NFTS!",
    icon: <CurrencyDollarIcon />,
    requireWallet: true,
    featureDialog: NFTsDialog,
  },
]

const Features: React.FC = () => {
  return (
    <VStack spacing={4} align="flex-start">
      <Heading> Features </Heading>
      <SimpleGrid columns={2} spacing={4} w={"full"}>
        {FeatureList.map((feature) => {
          return <FeatureCard key={feature.name} feature={feature} />
        })}
      </SimpleGrid>
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
