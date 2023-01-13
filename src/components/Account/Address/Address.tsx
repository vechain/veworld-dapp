import { Text, Icon, useClipboard, HStack, Button, Tag } from "@chakra-ui/react"
import { DocumentDuplicateIcon, CheckIcon } from "@heroicons/react/24/solid"
import React from "react"
import { humanAddress } from "../../../utils/FormattingUtils"

interface IAddress {
  address: string
  copyable?: boolean
}
const Address: React.FC<IAddress> = ({ address, copyable = true }) => {
  const { onCopy, hasCopied } = useClipboard(address)

  if (copyable)
    return (
      <Button variant="unstyled" onClick={onCopy}>
        <Tag colorScheme="blue">
          <HStack spacing={2}>
            <Text>{humanAddress(address)}</Text>
            <Icon as={hasCopied ? CheckIcon : DocumentDuplicateIcon} />
          </HStack>
        </Tag>
      </Button>
    )
  return (
    <Tag colorScheme="blue">
      <Text>{humanAddress(address)}</Text>
    </Tag>
  )
}

export default Address
