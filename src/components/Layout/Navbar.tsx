import {
  Icon,
  Box,
  Flex,
  Text,
  HStack,
  Tag,
  useColorModeValue,
} from "@chakra-ui/react"
import React from "react"
import Logo from "../Logo/Logo"
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher"
import ConnectWalletButton from "../ConnectWalletButton/ConnectWalletButton"
import { useWallet } from "../../context/walletContext"
import { Network, NetworkInfo } from "../../model/enums"
import { GlobeAltIcon } from "@heroicons/react/24/solid"

const NavBar: React.FC = () => {
  const {
    state: { account, network },
  } = useWallet()

  const bg = useColorModeValue("gray.50", "gray.900")
  return (
    <Flex
      position={"sticky"}
      top={0}
      zIndex={1}
      bg={bg}
      shadow="xs"
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
      {account && network && <NetworkBadge network={network} />}
      <NavBarWalletConnect />
    </Flex>
  )
}

const NavBarWalletConnect = () => {
  return (
    <HStack spacing={4}>
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
    <Tag size="lg">
      <HStack fontSize={"lg"} spacing={2}>
        <Icon as={GlobeAltIcon} />
        <Text>{NetworkInfo[network].name}</Text>
      </HStack>
    </Tag>
  )
}

export default NavBar
