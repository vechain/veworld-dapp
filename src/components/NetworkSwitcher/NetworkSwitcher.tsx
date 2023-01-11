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
import { useWallet } from "../../context/walletContext"
import { Networks } from "../../service/ConnexService"

import { Select } from "chakra-react-select"
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
  return <Select options={networksOptions} value={selectedNetwork} />
}

export default NetworkSwitcher
