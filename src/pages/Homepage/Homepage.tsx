import React from "react"

import { Box, Grid, GridItem, VStack } from "@chakra-ui/react"
import Welcome from "../../components/Homepage/Welcome/Welcome"
import Features from "../../components/Homepage/Features/Features"
import MeetVeWorld from "../../components/Homepage/MeetVeWorld/MeetVeWorld"
export interface Token {
  address?: string
  name?: string
  symbol?: string
  decimals?: number
}

const Homepage: React.FC = () => {
  return (
    <VStack w="full" spacing={8}>
      <Grid
        w="full"
        templateRows="repeat(1, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap={8}
        alignItems="stretch"
        justifyItems={"stretch"}
      >
        <GridItem rowSpan={1} colSpan={[5, 5, 3]}>
          <Welcome />
        </GridItem>
        <GridItem rowSpan={1} colSpan={[5, 5, 2]}>
          <MeetVeWorld />
        </GridItem>
      </Grid>
      <Box w="full">
        <Features />
      </Box>
    </VStack>
  )
}

export default Homepage
