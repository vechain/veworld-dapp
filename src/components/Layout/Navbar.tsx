import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  Icon,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
  VStack,
  Text,
} from "@chakra-ui/react"
import React, { useCallback } from "react"
import Logo from "../Logo/Logo"
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher"
import ConnectWalletButton from "../ConnectWalletButton/ConnectWalletButton"
import { ActionType, useWallet } from "../../context/walletContext"
import NetworkBadge from "../Network/NetworkBadge/NetworkBadge"
import { Bars3Icon } from "@heroicons/react/24/solid"
import { AccountDetailBody } from "../ConnectedWalletDialog/ConnectedWalletDialog"

const NavBar: React.FC = () => {
  const bg = useColorModeValue("gray.50", "gray.900")
  const [isDesktop] = useMediaQuery("(min-width: 48em)")

  return (
    <Flex
      position={"sticky"}
      top={0}
      zIndex={1}
      bg={bg}
      shadow="xs"
      py={2}
      px={[4, 4, 20]}
      w={"full"}
      flexDirection="row"
      justifyContent="space-between"
      alignItems={"center"}
      borderBottomWidth={"1px"}
    >
      {isDesktop ? <DesktopNavBar /> : <MobileNavBar />}
    </Flex>
  )
}

const DesktopNavBar = () => {
  const {
    state: { account, network },
  } = useWallet()
  return (
    <>
      <Box h="30px">
        <Logo />
      </Box>
      {account && network && <NetworkBadge network={network} />}
      <NavBarWalletConnect />
    </>
  )
}

const MobileNavBar = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (
    <>
      <MobileNavBarDrawer isOpen={isOpen} onClose={onClose} />
      <Box h="30px">
        <Logo />
      </Box>
      <IconButton
        aria-label="light"
        icon={<Icon as={Bars3Icon} />}
        onClick={onOpen}
        fontSize="20px"
      />
    </>
  )
}

interface IMobileNavBarDrawer {
  isOpen: boolean
  onClose: () => void
}
const MobileNavBarDrawer: React.FC<IMobileNavBarDrawer> = ({
  isOpen,
  onClose,
}) => {
  const {
    dispatch,
    state: { account, network },
  } = useWallet()

  const disconnectWallet = useCallback(
    () => dispatch({ type: ActionType.CLEAR }),
    []
  )

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody w="full">
          <VStack justifyContent={"space-between"} w="full" h="full">
            <VStack spacing={4} w="full" alignItems={"flex-start"}>
              <Text>Connected Wallet</Text>
              {account && network ? (
                <AccountDetailBody
                  account={account}
                  network={network}
                  disconnectWallet={disconnectWallet}
                />
              ) : (
                <ConnectWalletButton />
              )}
            </VStack>
            <ThemeSwitcher withText={true} />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
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

export default NavBar
