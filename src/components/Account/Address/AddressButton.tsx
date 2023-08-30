import {
  Button,
  HStack,
  HTMLChakraProps,
  Icon,
  Text,
  useClipboard,
} from "@chakra-ui/react"
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/solid"
import React, { useEffect } from "react"
import { humanAddress } from "../../../utils/FormattingUtils"
import AddressIcon from "./AddressIcon"

interface IAddressButton extends HTMLChakraProps<"button"> {
  address: string
  showAddressIcon?: boolean
  showCopyIcon?: boolean
}

const AddressButton: React.FC<IAddressButton> = ({
  address,
  showAddressIcon = true,
  showCopyIcon = true,
  ...props
}) => {
  const { onCopy, hasCopied, setValue } = useClipboard(address)

  const { onClick, ...otherProps } = props

  const onClickHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // console.log(onClick)
    if (onClick) onClick(e)
    if (showCopyIcon) onCopy()
  }

  useEffect(() => {
    setValue(address)
  }, [setValue, address])

  return (
    <Button
      colorScheme={"gray"}
      onClick={onClickHandler}
      {...(showAddressIcon && { paddingLeft: 0 })}
      paddingY={0}
      variant="outline"
      {...otherProps}
    >
      <HStack justify={"flex-start"} spacing={4} h="full" roundedLeft={"md"}>
        {showAddressIcon && (
          <AddressIcon address={address} roundedLeft={"md"} />
        )}
        <Text fontSize={"md"}>{humanAddress(address, 6, 6)}</Text>
        {showCopyIcon && (
          <Icon
            aria-label="Copy Address"
            as={hasCopied ? CheckIcon : DocumentDuplicateIcon}
          />
        )}
      </HStack>
    </Button>
  )
}

export default AddressButton
