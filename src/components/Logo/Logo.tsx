import { Image, useColorModeValue } from "@chakra-ui/react"

const lightModeUrl = process.env.PUBLIC_URL + "/images/vechain_logo.png"
const darkModeUrl = process.env.PUBLIC_URL + "/images/vechain_logo_white.png"

const Logo = () => {
  const logoUrl = useColorModeValue(lightModeUrl, darkModeUrl)
  return <Image h="full" objectFit="cover" alt="vechain logo" src={logoUrl} />
}

export default Logo
