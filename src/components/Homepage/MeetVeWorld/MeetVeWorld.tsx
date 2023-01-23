import { Button, Heading, Link, Text, VStack } from "@chakra-ui/react"
import StyledCard from "../../Shared/StyledCard/StyledCard"
import { WalletSource, WalletSourceInfo } from "../../../model/enums"

const MeetVeWorld = () => {
  const veWorldSource = WalletSourceInfo[WalletSource.VEWORLD]
  return (
    <StyledCard p={4} h={["auto", "auto", "full"]}>
      <VStack w="full" align={"flex-start"} spacing={4}>
        <Heading>Meet VeWorld</Heading>
        <Text fontSize="xl">
          The new browser-based wallet coming straightly from the Vechain
          Foundation. Built with state of the art technologies, security and
          ease of use in mind.
        </Text>
        <Button variant="link" colorScheme="blue">
          <Link href={veWorldSource.url} isExternal>
            Discover more
          </Link>
        </Button>
      </VStack>
    </StyledCard>
  )
}

export default MeetVeWorld
