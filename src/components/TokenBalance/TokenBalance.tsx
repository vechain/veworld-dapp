import React, { useEffect, useState } from "react"
import { getToken } from "../../store/tokenSlice"
import { useAppSelector } from "../../store/hooks"
import { getSelectedAccount } from "../../store/walletSlice"
import { Card, Layout, Typography } from "antd"
import { Content } from "antd/es/layout/layout"
import ConnexService from "../../service/ConnexService"
import VIP180Service from "../../service/VIP180Service"

const { Text } = Typography

const TokenBalance: React.FC = () => {
  const token = useAppSelector(getToken)
  const account = useAppSelector(getSelectedAccount)
  const [balance, setBalance] = useState<string>()
  const [updateTime, setUpdateTime] = useState<number>()

  useEffect(() => {
    if (!token || !account) return

    refreshBalance().then(() => {
      setUpdateTime(Date.now())
    })
    //Refresh the balance every time `updateTime` is changed (Every block)
  }, [updateTime])

  const refreshBalance = async () => {
    if (!token.address || !account) return

    const newBalance = await VIP180Service.getBalance(
      account.address,
      token.address
    )

    console.log(`Account (${account.address}) balance: ${newBalance}`)

    setBalance(newBalance)

    //Wait until the next block before returning
    const connex = await ConnexService.getConnex()
    await connex.thor.ticker().next()
  }

  if (!token.address || !account) return <></>

  return (
    <Card className={"my-10"}>
      <Content className="h-full">
        <Layout className={"viewport"}>
          <Text strong className={"font-sans text-base font-normal"}>
            Account:
          </Text>
          <Text copyable className={"font-sans text-base font-normal"}>
            {account.address}
          </Text>
          <Text strong className={"font-sans text-base font-normal"}>
            Token Balance:
          </Text>
          <Text className={"font-sans text-base font-normal"}>{balance}</Text>
        </Layout>
      </Content>
    </Card>
  )
}

export default TokenBalance
