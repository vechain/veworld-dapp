import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react"
import React, { useCallback } from "react"
import { VechainLogo } from "../Logo/Logo"
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher"
import ConnectWalletButton from "../ConnectWalletButton/ConnectWalletButton"
import { ActionType, useWallet } from "../../context/WalletContext"
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
        <VechainLogo />
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
        <VechainLogo />
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
    [dispatch]
  )

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody w="full">
          <VStack justifyContent={"space-between"} w="full" h="full">
            <VStack spacing={4} w="full" alignItems={"flex-start"}>
              <Text>Connected Wallet</Text>
              {account.address && network ? (
                <AccountDetailBody
                  accountSource={account.source}
                  accountAddress={account.address}
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
