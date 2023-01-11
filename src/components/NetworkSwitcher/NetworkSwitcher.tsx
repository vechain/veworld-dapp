import {
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react"
import { ArrowSmallDownIcon } from "@heroicons/react/24/solid"
import { useMemo } from "react"
import { ActionType, useWallet } from "../../context/walletContext"
import { Network, Networks } from "../../service/ConnexService"

import { Select, SingleValue } from "chakra-react-select"
import CircleIcon from "../Icons/CircleIcon"

const NetworkSwitcher = () => {
  const {
    state: { network },
    dispatch,
  } = useWallet()

  const networksOptions = Networks.map((network) => ({
    value: network.name,
    label: (
      <Flex direction={"row"} alignItems="center" gap={2}>
        <CircleIcon />
        <Text>{network.name}</Text>
      </Flex>
    ),
  }))

  const selectedNetwork = useMemo(
    () => networksOptions.find((net) => net.value === network),
    [network, networksOptions]
  )

  const onNetworkChange = (
    newValue: SingleValue<{
      value: string
      label: JSX.Element
    }>
  ) =>
    newValue &&
    dispatch({
      type: ActionType.SET_NETWORK,
      payload: Network[newValue.value as keyof typeof Network],
    })
  return (
    <Select
      options={networksOptions}
      defaultValue={selectedNetwork}
      onChange={onNetworkChange}
    />
  )
}

export default NetworkSwitcher
