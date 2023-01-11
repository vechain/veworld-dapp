import {
  Alert,
  AlertIcon,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { CurrencyDollarIcon } from "@heroicons/react/24/solid"
import React from "react"
import { useWallet } from "../../../context/walletContext"

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
    <Card>
      <CardBody>
        <Heading fontSize={"2xl"}>{feature.name}</Heading>
        <Text fontSize={"md"}>{feature.desc}</Text>
        <Button disabled={isDisabled} mt={4} w="full" colorScheme={"blue"}>
          Get started
        </Button>
        {isDisabled && <Text as="u">Connect a wallet first</Text>}
      </CardBody>
    </Card>
  )
}

export default Features
