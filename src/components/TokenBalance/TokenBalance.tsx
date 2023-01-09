import React, { useEffect, useState } from "react"
import { Card, Layout, Typography } from "antd"
import { Content } from "antd/es/layout/layout"
import ConnexService from "../../service/ConnexService"
import VIP180Service from "../../service/VIP180Service"
import { Token } from "../../pages/Homepage/Homepage"

const { Text } = Typography

const TokenBalance: React.FC<{
  token: Token
  accountAddress: string
}> = ({ token, accountAddress }) => {
  const [balance, setBalance] = useState<string>()
  const [updateTime, setUpdateTime] = useState<number>()

  useEffect(() => {
    refreshBalance().then(() => {
      setUpdateTime(Date.now())
    })
    //Refresh the balance every time `updateTime` is changed (Every block)
  }, [accountAddress, token])

  const refreshBalance = async () => {
    if (!token.address || !accountAddress) return

    const newBalance = await VIP180Service.getBalance(
      accountAddress,
      token.address
    )

    console.log(`Account (${accountAddress}) balance: ${newBalance}`)

    setBalance(newBalance)

    //Wait until the next block before returning
    const connex = await ConnexService.getConnex()
    await connex.thor.ticker().next()
  }

  return (
    <Card className={"my-10"}>
      <Content className="h-full">
        <Layout className={"viewport"}>
          <Text strong className={"font-sans text-base font-normal"}>
            Contract Address:
          </Text>
          <Text copyable className={"font-sans text-base font-normal"}>
            {token.address}
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
