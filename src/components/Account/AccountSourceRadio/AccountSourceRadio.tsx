import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react"
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
  const installVeWorld = () => {
    return (
      <Alert key={WalletSource.VEWORLD} status={"warning"}>
        <AlertIcon />
        <Box>
          <AlertTitle>VeWorld not installed</AlertTitle>
        </Box>
      </Alert>
    )
  }

  return (
    <VStack spacing={4} w="full">
      {Object.entries(WalletSourceInfo).map(([key, value]) => {
        const isSelected = key === selected
        const onClick = () => onChange(key as WalletSource)

        if (key === WalletSource.VEWORLD && !window.vechain)
          return installVeWorld()

        return (
          <RadioCard key={key} selected={isSelected} onClick={onClick}>
            <HStack spacing={2}>
              <Image
                objectFit={"cover"}
                w={35}
                h={35}
                alt={`${value.name}-logo`}
                src={value.logo}
              />
              <Text color={"primary"}>{value.name}</Text>
            </HStack>
          </RadioCard>
        )
      })}
    </VStack>
  )
}

export default AccountSourceRadio
