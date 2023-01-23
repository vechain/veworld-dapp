import {
  Card,
  CardBody,
  HTMLChakraProps,
  useColorModeValue,
} from "@chakra-ui/react"
import React from "react"

interface IStyledCard extends HTMLChakraProps<"div"> {
  children: React.ReactNode
}
const StyledCard: React.FC<IStyledCard> = ({ children, ...props }) => {
  const cardBg = useColorModeValue("white", "gray.700")
  return (
    <Card bg={cardBg} {...props}>
      <CardBody>{children}</CardBody>
    </Card>
  )
}

export default StyledCard
