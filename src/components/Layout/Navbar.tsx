import { Button, Flex } from "@chakra-ui/react"
import React from "react"
import { WalletSource } from "../../service/LocalStorageService"
import Logo from "../Logo/Logo"

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
      <NavBarWalletConnect />
    </Flex>
  )
}

const NavBarWalletConnect = () => {
  const connectWalletOptions = Object.values(WalletSource).map((value) => ({
    label: value,
    action: () => null,
  }))
  return <Button> Connect Wallet </Button>
}

export default NavBar
