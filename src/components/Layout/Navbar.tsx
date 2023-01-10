import React from "react"
import { WalletSource } from "../../service/LocalStorageService"
import Logo from "../Logo/Logo"
import MenuDropdown from "../Shared/Menu"

const NavBar: React.FC = () => {
  return (
    <nav className="w-full px-4 py-2 spacer-x justify-between h-16 items-center bg-white shadow-md rounded-b">
      <Logo />
      <NavBarWalletConnect />
    </nav>
  )
}

const NavBarWalletConnect = () => {
  const connectWalletOptions = Object.values(WalletSource)
  return <MenuDropdown title="Connect wallet" options={connectWalletOptions} />
}

export default NavBar
