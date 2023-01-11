import {
  Flex,
  Text,
  Icon,
  useClipboard,
  IconButton,
  HStack,
} from "@chakra-ui/react"
import { DocumentDuplicateIcon, CheckIcon } from "@heroicons/react/24/solid"
import React from "react"
import { humanAddress } from "../../../utils/FormattingUtils"

interface IAddress {
  address: string
  copyable?: boolean
}
const Address: React.FC<IAddress> = ({ address, copyable = true }) => {
  const { onCopy, hasCopied } = useClipboard(address)
  return (
    <HStack spacing={2}>
      <Text>{humanAddress(address)}</Text>
      {copyable && (
        <IconButton
          variant={"ghost"}
          onClick={onCopy}
          aria-label={`copy-address-${address}`}
          icon={<Icon as={hasCopied ? CheckIcon : DocumentDuplicateIcon} />}
        />
      )}
    </HStack>
  )
}

export default Address
