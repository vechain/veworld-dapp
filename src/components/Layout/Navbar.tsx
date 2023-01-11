import { Icon, Box, Flex, Tag, Text } from "@chakra-ui/react"
import React from "react"
import Logo from "../Logo/Logo"
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher"
import NetworkSwitcher from "../NetworkSelect/NetworkSelect"
import ConnectWalletButton from "../ConnectWalletButton/ConnectWalletButton"
import { ActionType, useWallet } from "../../context/walletContext"
import { Network, NetworkInfo } from "../../model/enums"
import { GlobeAltIcon } from "@heroicons/react/24/solid"

const NavBar: React.FC = () => {
  return (
    <Flex
      py={2}
      px={4}
      w={"full"}
      flexDirection="row"
      justifyContent="space-between"
      alignItems={"center"}
      boxShadow="xs"
    >
      <Logo />
      <Box width={"30%"}>
        <NavBarWalletConnect />
      </Box>
    </Flex>
  )
}

const NavBarWalletConnect = () => {
  const {
    state: { account, network },
  } = useWallet()

  return (
    <Flex gap={2} direction="row">
      {account && network && <NetworkBadge network={network} />}
      <ConnectWalletButton />
      <ThemeSwitcher />
    </Flex>
  )
}

interface INetworkBadge {
  network: Network
}
const NetworkBadge: React.FC<INetworkBadge> = ({ network }) => {
  return (
    <Tag flexDir="row" gap={2}>
      <Icon as={GlobeAltIcon} />
      <Text>{NetworkInfo[network].name}</Text>
    </Tag>
  )
}
const GlobalNetworkSwitcher = () => {
  const {
    state: { network },
    dispatch,
  } = useWallet()

  const onNetworkChange = (newNetwork: Network) =>
    dispatch({
      type: ActionType.SET_NETWORK,
      payload: newNetwork,
    })

  return <NetworkSwitcher selected={network} onChange={onNetworkChange} />
}

export default NavBar
