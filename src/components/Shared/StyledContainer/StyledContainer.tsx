import { Box, Container, useColorModeValue } from "@chakra-ui/react"
import React from "react"

interface IStyledContainer {
  children: React.ReactNode
}
const StyledContainer: React.FC<IStyledContainer> = ({ children }) => {
  const bodyBg = useColorModeValue("gray.50", "gray.900")

  return (
    <Box bg={bodyBg} minH="100vh">
      <Container maxW="6xl" bg={bodyBg} centerContent py={8}>
        {children}
      </Container>
    </Box>
  )
}

export default StyledContainer
