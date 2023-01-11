import { Box, Card, CardBody, Heading, Text, VStack } from "@chakra-ui/react"
import ConnectWalletButton from "../../ConnectWalletButton/ConnectWalletButton"
import Logo from "../../Logo/Logo"

const Welcome = () => {
  return (
    <Card>
      <CardBody>
        <VStack w="full" align={"flex-start"} spacing={4} p={[16, 8]}>
          {/* <Box h="50px">
            <Logo />
          </Box> */}
          <Heading>Welcome to the Official VeWorld Demo Dapp</Heading>
          <Text fontSize="xl">
            You can use this dapp to familiarize and know more about creation on
            VeChain
          </Text>
          <ConnectWalletButton />
        </VStack>
      </CardBody>
    </Card>
  )
}

export default Welcome
