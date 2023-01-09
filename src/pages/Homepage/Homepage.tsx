import React, { useEffect, useState } from "react"
import { Layout } from "antd"
import ConnectToExtension from "../../components/ConnectToExtension/ConnectToExtension"
import DeployToken from "../../components/DeployToken/DeployToken"
import TokenBalance from "../../components/TokenBalance/TokenBalance"
import MintToken from "../../components/MintToken/MintToken"
import ConnexService, { Network } from "../../service/ConnexService"
import LocalStorageService, {
  WalletSource,
} from "../../service/LocalStorageService"
import Account from "../../components/Account/Account"

export interface AccountState {
  address: string
  source: WalletSource
}

export interface Token {
  address?: string
  name?: string
  symbol?: string
  decimals?: number
}

const Homepage: React.FC = () => {
  const [account, setAccount] = useState<AccountState | undefined>(
    LocalStorageService.getAccount()
  )
  const [network, setNetwork] = useState<Network | undefined>(
    LocalStorageService.getNetwork()
  )
  const [token, setToken] = useState<Token | undefined>(
    LocalStorageService.getToken()
  )

  useEffect(() => {
    if (account?.source && network) {
      ConnexService.initialise(account.source, network)
    }
  }, [account, network, token])

  const persistAccount = (account: AccountState) => {
    setAccount(account)
    LocalStorageService.setAccount(account)
  }

  const persistNetwork = (network: Network) => {
    setNetwork(network)
    LocalStorageService.setNetwork(network)
  }

  const persistToken = (token: Token) => {
    setToken(token)
    LocalStorageService.setToken(token)
  }

  const clearState = () => {
    LocalStorageService.clear()
    ConnexService.clear()
    setAccount(undefined)
    setToken(undefined)
    setNetwork(undefined)
  }

  return (
    <div
      className={
        "h-full w-full py-10 flex flex-col justify-center items-center"
      }
    >
      <Layout className={"w-[80%] float-center"}>
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
          <ConnectToExtension
            setAccount={persistAccount}
            setNetwork={persistNetwork}
          />
        )}
      </Layout>
    </div>
  )
}

export default Homepage
