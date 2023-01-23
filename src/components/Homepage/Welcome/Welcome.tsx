import { Heading, Text, VStack } from "@chakra-ui/react"
import ConnectWalletButton from "../../ConnectWalletButton/ConnectWalletButton"
import StyledCard from "../../Shared/StyledCard/StyledCard"

const Welcome = () => {
  return (
    <StyledCard p={4} h={["auto", "auto", "full"]}>
      <VStack w="full" align={"flex-start"} spacing={4}>
        <Heading>Welcome to the Official VeWorld Demo Dapp</Heading>
        <Text fontSize="xl">
          You can use this dapp to familiarize and know more about creation on
          VeChain
        </Text>
        <ConnectWalletButton />
      </VStack>
    </StyledCard>
  )
}

export default Welcome
