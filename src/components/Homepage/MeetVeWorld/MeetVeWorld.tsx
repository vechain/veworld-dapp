import { Box, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react"
import { VeWorldLogo } from "../../Logo/Logo"
import StyledCard from "../../Shared/StyledCard/StyledCard"

const MeetVeWorld = () => {
  return (
    <StyledCard p={4} h={["auto", "auto", "full"]}>
      <VStack w="full" align={"flex-start"} spacing={4}>
        <HStack w="full" justify={"space-between"}>
          <Heading>Meet VeWorld</Heading>{" "}
          <Box h="45px">
            <VeWorldLogo rounded={"lg"} />
          </Box>
        </HStack>
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
