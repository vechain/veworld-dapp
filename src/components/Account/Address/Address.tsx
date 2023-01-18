import {
  Text,
  Icon,
  useClipboard,
  HStack,
  Tag,
  IconButton,
} from "@chakra-ui/react"
import { DocumentDuplicateIcon, CheckIcon } from "@heroicons/react/24/solid"
import React from "react"
import { humanAddress } from "../../../utils/FormattingUtils"
import AddressIcon from "./AddressIcon"

interface IAddress {
  address: string
  showAddressIcon?: boolean
  copyable?: boolean
}
const AddressTag: React.FC<IAddress> = ({
  address,
  showAddressIcon = true,
  copyable = true,
}) => {
  const { onCopy, hasCopied } = useClipboard(address)

  if (copyable)
    return (
      <HStack spacing={1}>
        {showAddressIcon && (
          <AddressIcon address={address} h={6} rounded="md" />
        )}
        <Text as="b">{humanAddress(address)}</Text>
        <IconButton
          variant={"ghost"}
          onClick={onCopy}
          aria-label="Copy Address"
          icon={
            <Icon
              aria-label="Copy Address"
              as={hasCopied ? CheckIcon : DocumentDuplicateIcon}
            />
          }
        />
      </HStack>
    )
  return (
    <Tag colorScheme="blue">
      <Text>{humanAddress(address)}</Text>
    </Tag>
  )
}

export default AddressTag
