import { Box, HStack } from "@chakra-ui/react"
import React from "react"

interface IRadioCard {
  children: React.ReactNode
  selected: boolean
  onClick: () => void
}
const RadioCard: React.FC<IRadioCard> = ({ children, selected, onClick }) => {
  const backgroundBorderColor = selected ? "teal.600" : "lightgray"
  const textColor = selected ? "white" : "black"

  return (
    <HStack
      spacing={2}
      onClick={onClick}
      cursor="pointer"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      backgroundColor={backgroundBorderColor}
      borderColor={backgroundBorderColor}
      color={textColor}
      _focus={{
        boxShadow: "outline",
      }}
      px={3}
      py={1.5}
    >
      <RadioCircle filled={selected} />
      {children}
    </HStack>
  )
}

interface IRadioCircle {
  filled?: boolean
}
const RadioCircle: React.FC<IRadioCircle> = ({ filled = false }) => {
  return (
    <Box
      h={1}
      w={1}
      borderRadius="full"
      border="1px solid"
      borderColor={"lightgray"}
      bg={filled ? "purple.400" : "gray"}
      p={1}
    />
  )
}
export default RadioCard
