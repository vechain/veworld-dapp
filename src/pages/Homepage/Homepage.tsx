import React, { useState } from "react"
import { Layout } from "antd"
import ConnectToExtension from "../../components/ConnectToExtension/ConnectToExtension"
import DeployToken from "../../components/DeployToken/DeployToken"
import TokenBalance from "../../components/TokenBalance/TokenBalance"
import MintToken from "../../components/MintToken/MintToken"
import { Network } from "../../service/ConnexService"
import LocalStorageService from "../../service/LocalStorageService"
import Account from "../../components/Account/Account"
import { ActionType, useWallet } from "../../context/walletContext"
import { IAccount } from "../../model/State"
import NavBar from "../../components/Layout/Navbar"

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

  return (
    <div className={"flex flex-col justify-center items-center"}>
      {account ? (
        <>
          <Account account={account} clearState={clearState} />

          {token?.address ? (
            <>
              <TokenBalance accountAddress={account.address} token={token} />
              <MintToken accountAddress={account.address} token={token} />
            </>
          ) : (
            <DeployToken
              setToken={persistToken}
              accountAddress={account.address}
            />
          )}
        </>
      ) : (
        <ConnectToExtension setAccount={setAccount} setNetwork={setNetwork} />
      )}
    </div>
  )
}

export default Homepage
