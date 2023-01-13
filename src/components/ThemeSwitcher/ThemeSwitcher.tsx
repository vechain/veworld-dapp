import { Box, Icon, IconButton } from "@chakra-ui/react"
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid"
import { useColorMode } from "@chakra-ui/react"

function ThemeSwitcher() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Box>
      {colorMode === "dark" ? (
        <IconButton
          aria-label="dark"
          fontSize="20px"
          icon={<Icon as={SunIcon} />}
          onClick={toggleColorMode}
        />
      ) : (
        <IconButton
          aria-label="light"
          icon={<Icon as={MoonIcon} />}
          onClick={toggleColorMode}
          fontSize="20px"
        />
      )}
    </Box>
  )
}

export default ThemeSwitcher
