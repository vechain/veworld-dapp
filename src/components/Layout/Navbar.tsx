import { Box, Button, Flex, Icon } from "@chakra-ui/react"
import React from "react"
import { WalletSource } from "../../service/LocalStorageService"
import Logo from "../Logo/Logo"
import { WalletIcon } from "@heroicons/react/24/solid"
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher"
import NetworkSwitcher from "../NetworkSwitcher/NetworkSwitcher"
import ConnectWalletButton from "../ConnectWalletButton/ConnectWalletButton"

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
  const connectWalletOptions = Object.values(WalletSource).map((value) => ({
    label: value,
    action: () => null,
  }))
  return (
    <Flex gap={2} direction="row">
      <Box flex={1.5}>
        <NetworkSwitcher />
      </Box>
      <ConnectWalletButton />
      <ThemeSwitcher />
    </Flex>
  )
}

export default NavBar
