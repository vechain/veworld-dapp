import { Box, Flex, HStack, HTMLChakraProps } from "@chakra-ui/react"
import React from "react"

interface IRadioCard {
  children: React.ReactNode
  selected: boolean
  onClick: () => void
}
const RadioCard: React.FC<IRadioCard> = ({ children, selected, onClick }) => {
  return (
    <HStack
      spacing={2}
      w="full"
      onClick={onClick}
      cursor="pointer"
      justify={"space-between"}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      // backgroundColor={backgroundBorderColor}
      shadow={selected ? "outline" : "none"}
      // color={textColor}
      _focus={{
        boxShadow: "outline",
      }}
      px={3}
      py={1.5}
    >
      {children}
      <RadioCircle filled={selected} />
    </HStack>
  )
}

interface IRadioCircle extends HTMLChakraProps<"div"> {
  filled?: boolean
}
const RadioCircle: React.FC<IRadioCircle> = ({ filled = false, ...props }) => {
  return (
    <Flex
      rounded="full"
      border="1px solid"
      borderColor={"lightgray"}
      justify="center"
      align={"center"}
      p={1}
      {...props}
    >
      <Box
        display={"block"}
        h={2.5}
        minW={2.5}
        w={2.5}
        bg={filled ? "blue.500" : "transparent"}
        margin="auto"
        rounded="full"
      />
    </Flex>
  )
}
export default RadioCard
