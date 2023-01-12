import { Card, CardBody, useColorModeValue } from "@chakra-ui/react"
import React from "react"

interface IStyledCard {
  children: React.ReactNode
}
const StyledCard: React.FC<IStyledCard> = ({ children }) => {
  const cardBg = useColorModeValue("white", "gray.700")
  return (
    <Card bg={cardBg}>
      <CardBody>{children}</CardBody>
    </Card>
  )
}

export default StyledCard
