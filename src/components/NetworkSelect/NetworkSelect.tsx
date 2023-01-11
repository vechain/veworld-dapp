import { Flex, Icon, Text } from "@chakra-ui/react"
import React, { useMemo } from "react"

import { Select, SingleValue } from "chakra-react-select"
import { Network, NetworkInfo } from "../../model/enums"
import { GlobeAltIcon } from "@heroicons/react/24/solid"

interface INetworkSelectOption {
  label: React.ReactNode
  value: Network
}

interface INetworkSelect {
  selected?: Network
  onChange: (network: Network) => void
}
const NetworkSelect: React.FC<INetworkSelect> = ({ selected, onChange }) => {
  const networksOptions: INetworkSelectOption[] = Object.entries(
    NetworkInfo
  ).map(([key, value]) => ({
    value: key as Network,
    label: (
      <Flex direction={"row"} alignItems="center" gap={2}>
        <Icon as={GlobeAltIcon} />
        <Text>{value.name}</Text>
      </Flex>
    ),
  }))

  const selectedNetwork = useMemo(
    () => networksOptions.find((net) => net.value === selected),
    [selected, networksOptions]
  )

  const onNetworkChange = (newValue: SingleValue<INetworkSelectOption>) => {
    if (newValue) onChange(newValue.value)
  }
  return (
    <Select
      options={networksOptions}
      value={selectedNetwork}
      onChange={onNetworkChange}
    />
  )
}

export default NetworkSelect
