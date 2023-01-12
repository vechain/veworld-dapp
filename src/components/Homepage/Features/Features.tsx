import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Icon,
  Heading,
  HStack,
  Text,
  VStack,
  Box,
  Flex,
  Tooltip,
} from "@chakra-ui/react"
import React from "react"
import { useWallet } from "../../../context/walletContext"
import { CurrencyDollarIcon, WalletIcon } from "@heroicons/react/24/solid"

interface IFeature {
  name: string
  desc: string
  requireWallet: boolean
  icon?: React.ReactNode
  path?: string
}
const FeatureList: IFeature[] = [
  {
    name: "Deploy a token",
    desc: "Create a new token on VeChain in seconds!",
    icon: <CurrencyDollarIcon />,
    requireWallet: true,
  },
]

const Features: React.FC = () => {
  return (
    <VStack spacing={4} align="flex-start">
      <Heading> Features </Heading>
      <HStack spacing={4}>
        {FeatureList.map((feature) => (
          <FeatureCard key={feature.name} feature={feature} />
        ))}
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

  const isDisabled = feature.requireWallet && !account

  return (
    <Box position={"relative"}>
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
      <Card>
        <CardBody>
          <VStack spacing={2} align="flex-start">
            <Heading fontSize={"2xl"}>{feature.name}</Heading>
            <Text fontSize={"md"}>{feature.desc}</Text>
            <Button
              disabled={isDisabled}
              colorScheme={"blue"}
              variant="outline"
            >
              Get started
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  )
}

export default Features
