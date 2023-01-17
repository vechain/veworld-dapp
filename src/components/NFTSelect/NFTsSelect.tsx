import { Flex, Text } from "@chakra-ui/react"
import React, { useMemo } from "react"

import { Select, SingleValue } from "chakra-react-select"
import { INonFungibleToken } from "../../model/State"

interface INFTSelectOption {
  label: React.ReactNode
  value: string
}

interface INFTSelect {
  selected?: INonFungibleToken
  onChange: (nft: INonFungibleToken) => void
  nfts: INonFungibleToken[]
}
const NFTsSelect: React.FC<INFTSelect> = ({ selected, onChange, nfts }) => {
  const tokensOptions: INFTSelectOption[] = nfts.map((nft) => ({
    value: nft.address,
    label: (
      <Flex direction={"row"} alignItems="center" gap={2}>
        <Text>
          {nft.name} ({nft.symbol})
        </Text>
      </Flex>
    ),
  }))

  const selectedNetwork = useMemo(
    () => tokensOptions.find((net) => net.value === selected?.address),
    [selected, tokensOptions]
  )

  const onNftChange = (newValue: SingleValue<INFTSelectOption>) => {
    if (newValue) {
      const nft = nfts.find((nft) => nft.address === newValue.value)
      if (nft) onChange(nft)
    }
  }
  return (
    <Select
      options={tokensOptions}
      value={selectedNetwork}
      onChange={onNftChange}
    />
  )
}

export default NFTsSelect
