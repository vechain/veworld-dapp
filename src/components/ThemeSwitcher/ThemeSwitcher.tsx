import { Button, Icon, IconButton } from "@chakra-ui/react"
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid"
import { useColorMode } from "@chakra-ui/react"
import React from "react"

interface IThemeSwitcher {
  withText?: boolean
}
const ThemeSwitcher: React.FC<IThemeSwitcher> = ({ withText = "" }) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === "dark"
  if (withText)
    return (
      <Button
        aria-label={isDark ? "dark" : "light"}
        fontSize="20px"
        leftIcon={<Icon as={isDark ? SunIcon : MoonIcon} />}
        onClick={toggleColorMode}
      >
        Change theme
      </Button>
    )
  return (
    <IconButton
      aria-label={isDark ? "dark" : "light"}
      fontSize="20px"
      icon={<Icon as={isDark ? SunIcon : MoonIcon} />}
      onClick={toggleColorMode}
    />
  )
}

export default ThemeSwitcher
