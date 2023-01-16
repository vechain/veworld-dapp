import React from "react"
import { HTMLChakraProps, Img } from "@chakra-ui/react"
import { getPicassoImgSrc } from "../../../utils/PicassoUtils"

interface IAddressIcon extends HTMLChakraProps<"img"> {
  address: string
}
const AddressIcon: React.FC<IAddressIcon> = ({ address, ...props }) => {
  return <Picasso address={address} {...props} />
}

interface IPicasso extends HTMLChakraProps<"img"> {
  address: string
}
const Picasso: React.FC<IPicasso> = ({ address, ...props }) => {
  return (
    <Img
      objectFit={"cover"}
      src={getPicassoImgSrc(address)}
      h={"100%"}
      {...props}
    />
  )
}

export default AddressIcon
