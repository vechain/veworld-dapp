import { HStack, Tag, Text, Icon } from "@chakra-ui/react"
import { GlobeAltIcon } from "@heroicons/react/24/solid"
import React from "react"
import { Network, NetworkInfo } from "../../../model/enums"

interface INetworkBadge {
  network: Network
}
const NetworkBadge: React.FC<INetworkBadge> = ({ network }) => {
  return (
    <Tag size="lg">
      <HStack fontSize={"lg"} spacing={2}>
        <Icon as={GlobeAltIcon} />
        <Text>{NetworkInfo[network].name}</Text>
      </HStack>
    </Tag>
  )
}

export default NetworkBadge
