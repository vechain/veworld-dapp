import { Button, Card, CardBody, Heading, Text, VStack } from "@chakra-ui/react"

const MeetVeWorld = () => {
  return (
    <Card>
      <CardBody>
        <VStack w="full" align={"flex-start"} spacing={4} p={[16, 8]}>
          <Heading>Meet VeWorld</Heading>
          <Text fontSize="xl">
            The new browser-based wallet coming straightly from the Vechain
            Foundation. Built with state of the art technologies, security and
            ease of use in mind.
          </Text>
          <Button variant="link" colorScheme="blue">
            Discover more
          </Button>
          {/* <ConnectWalletButton /> */}
        </VStack>
      </CardBody>
    </Card>
  )
}

export default MeetVeWorld
