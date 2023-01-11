import { Box, Heading, Text, VStack } from "@chakra-ui/react"
import ConnectWalletButton from "../../components/ConnectWalletButton/ConnectWalletButton"
import Logo from "../../components/Logo/Logo"

const Welcome = () => {
  return (
    <VStack mt={32} borderWidth="1px" w="full" spacing={4} p={[16, 8]}>
      <Box h="50px">
        <Logo />
      </Box>
      <Heading>Welcome to the Official VeWorld Demo Dapp</Heading>
      <Text fontSize="xl">
        You can use this dapp and codebase to familiarize with Dapp creation on
        VeChain
      </Text>
      <ConnectWalletButton />
    </VStack>
  )
}

export default Welcome
