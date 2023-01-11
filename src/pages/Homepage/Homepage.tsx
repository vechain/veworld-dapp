import React, { useState } from "react"
import DeployToken from "../../components/DeployToken/DeployToken"
import TokenBalance from "../../components/TokenBalance/TokenBalance"
import MintToken from "../../components/MintToken/MintToken"
import LocalStorageService from "../../service/LocalStorageService"
import Account from "../../components/Account/Account"
import { ActionType, useWallet } from "../../context/walletContext"
import { IAccount } from "../../model/State"

import { Network } from "../../model/enums"
import { VStack } from "@chakra-ui/react"
export interface Token {
  address?: string
  name?: string
  symbol?: string
  decimals?: number
}

const Homepage: React.FC = () => {
  const [token, setToken] = useState<Token | undefined>(
    LocalStorageService.getToken()
  )

  const {
    state: { account, network },
    dispatch,
  } = useWallet()

  const persistToken = (token: Token) => {
    setToken(token)
    LocalStorageService.setToken(token)
  }

  const setAccount = (account: IAccount) =>
    dispatch({ type: ActionType.SET_ACCOUNT, payload: account })

  const setNetwork = (network: Network) =>
    dispatch({ type: ActionType.SET_NETWORK, payload: network })

  const clearState = () => dispatch({ type: ActionType.CLEAR })

  if (!account || !network) return <></>

  return (
    <VStack w="full" spacing={4}>
      <Account account={account} clearState={clearState} />

      {token?.address ? (
        <>
          <TokenBalance accountAddress={account.address} token={token} />
          <MintToken accountAddress={account.address} token={token} />
        </>
      ) : (
        <DeployToken setToken={persistToken} accountAddress={account.address} />
      )}
    </VStack>
  )
}

export default Homepage
