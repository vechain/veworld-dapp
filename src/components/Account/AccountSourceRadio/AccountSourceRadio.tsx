import { HStack, Text } from "@chakra-ui/react"
import React from "react"
import { WalletSource, WalletSourceInfo } from "../../../model/enums"
import RadioCard from "../../Shared/RadioCard/RadioCard"

interface IAccountSourceRadio {
  selected: WalletSource
  onChange: (source: WalletSource) => void
}
const AccountSourceRadio: React.FC<IAccountSourceRadio> = ({
  selected,
  onChange,
}) => {
  return (
    <HStack spacing={4}>
      {Object.entries(WalletSourceInfo).map(([key, value]) => {
        const isSelected = key === selected
        const onClick = () => onChange(key as WalletSource)
        return (
          <RadioCard key={key} selected={isSelected} onClick={onClick}>
            <Text>{value.name}</Text>
          </RadioCard>
        )
      })}
    </HStack>
  )
}

export default AccountSourceRadio
