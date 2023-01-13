import { Flex, Text } from "@chakra-ui/react"
import React, { useMemo } from "react"

import { Select, SingleValue } from "chakra-react-select"
import { IToken } from "../../model/State"

interface ITokenSelectOption {
  label: React.ReactNode
  value: string
}

interface ITokenSelect {
  selected?: IToken
  onChange: (token: IToken) => void
  tokens: IToken[]
}
const TokensSelect: React.FC<ITokenSelect> = ({
  selected,
  onChange,
  tokens,
}) => {
  const tokensOptions: ITokenSelectOption[] = tokens.map((token) => ({
    value: token.address,
    label: (
      <Flex direction={"row"} alignItems="center" gap={2}>
        <Text>
          {token.name} ({token.symbol})
        </Text>
      </Flex>
    ),
  }))

  const selectedNetwork = useMemo(
    () => tokensOptions.find((net) => net.value === selected?.address),
    [selected, tokensOptions]
  )

  const onTokenChange = (newValue: SingleValue<ITokenSelectOption>) => {
    if (newValue) {
      const token = tokens.find((tok) => tok.address === newValue.value)
      if (token) onChange(token)
    }
  }
  return (
    <Select
      options={tokensOptions}
      value={selectedNetwork}
      onChange={onTokenChange}
    />
  )
}

export default TokensSelect
