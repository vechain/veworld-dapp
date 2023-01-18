import { Box, Button, Flex, HStack, HTMLChakraProps } from "@chakra-ui/react"
import React from "react"

interface IRadioCard extends HTMLChakraProps<"button"> {
  children: React.ReactNode
  selected: boolean
  onClick: () => void
}
const RadioCard: React.FC<IRadioCard> = ({
  children,
  selected,
  onClick,
  ...props
}) => {
  return (
    <Button
      w="full"
      variant={"outline"}
      shadow={selected ? "outline" : "none"}
      {...props}
    >
      <HStack spacing={2} w="full" onClick={onClick} justify={"space-between"}>
        {children}
        <RadioCircle filled={selected} />
      </HStack>
    </Button>
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
