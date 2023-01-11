import { Box } from "@chakra-ui/react"
import React from "react"

interface IRadioCard {
  children: React.ReactNode
  selected: boolean
  onClick: () => void
}
const RadioCard: React.FC<IRadioCard> = ({ children, selected, onClick }) => {
  const backgroundBorderColor = selected ? "teal.600" : "transparent"
  const textColor = selected ? "white" : "black"

  return (
    <Box
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
      px={5}
      py={3}
    >
      {children}
    </Box>
  )
}
export default RadioCard
