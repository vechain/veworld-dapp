import React from "react"
import { useAppSelector } from "../../store/hooks"
import { getWallet } from "../../store/walletSlice"
import { Layout } from "antd"
import ConnectToExtension from "../../components/ConnectToExtension/ConnectToExtension"
import DeployToken from "../../components/DeployToken/DeployToken"
import { getToken } from "../../store/tokenSlice"
import TokenBalance from "../../components/TokenBalance/TokenBalance"
import MintToken from "../../components/MintToken/MintToken"

const Homepage: React.FC = () => {
  const wallet = useAppSelector(getWallet)
  const token = useAppSelector(getToken)

  return (
    <div
      className={
        "h-full w-full py-10 flex flex-col justify-center items-center"
      }
    >
      <Layout className={"w-[80%] float-center"}>
        <ConnectToExtension />

        {wallet.accounts.length > 0 && (
          <>
            <DeployToken />

            {token?.address && (
              <>
                <TokenBalance />
                <MintToken />
              </>
            )}
          </>
        )}
      </Layout>
    </div>
  )
}

export default Homepage
