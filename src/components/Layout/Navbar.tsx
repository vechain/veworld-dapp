import { Icon, Box, Flex, Tag, Text, HStack } from "@chakra-ui/react"
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
      px={20}
      w={"full"}
      flexDirection="row"
      justifyContent="space-between"
      alignItems={"center"}
      borderBottomWidth={"1px"}
    >
      <Box h="30px">
        <Logo />
      </Box>
      <NavBarWalletConnect />
    </Flex>
  )
}

const NavBarWalletConnect = () => {
  const {
    state: { account, network },
  } = useWallet()

  return (
    <HStack spacing={4}>
      {account && network && <NetworkBadge network={network} />}
      <ConnectWalletButton />
      <ThemeSwitcher />
    </HStack>
  )
}

interface INetworkBadge {
  network: Network
}
const NetworkBadge: React.FC<INetworkBadge> = ({ network }) => {
  return (
    <HStack fontSize={"lg"} spacing={2}>
      <Icon as={GlobeAltIcon} />
      <Text>{NetworkInfo[network].name}</Text>
    </HStack>
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
