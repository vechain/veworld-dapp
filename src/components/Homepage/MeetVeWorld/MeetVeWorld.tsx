import { Button, Heading, Text, VStack } from "@chakra-ui/react"
import StyledCard from "../../Shared/StyledCard/StyledCard"

const MeetVeWorld = () => {
  return (
    <StyledCard>
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
      </VStack>
    </StyledCard>
  )
}

export default MeetVeWorld