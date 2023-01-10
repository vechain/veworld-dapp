import React from "react"
import Logo from "../Logo/Logo"

const NavBar: React.FC = () => {
  return (
    <nav className="w-full spacer-x">
      <Logo />
      <NavBarWalletConnect />
    </nav>
  )
}

const NavBarWalletConnect = () => {
  return <></>
}

export default NavBar
