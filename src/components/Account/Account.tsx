import React from "react"
import { AccountState } from "../../pages/Homepage/Homepage"
import { Button, Card, Layout, Typography } from "antd"
import { Content } from "antd/es/layout/layout"

interface AccountProps {
  account: AccountState
  clearState: () => void
}

const { Text } = Typography

const Account: React.FC<AccountProps> = ({ account, clearState }) => {
  return (
    <Card className={"my-10"}>
      <Content className="h-full">
        <Layout className={"viewport"}>
          <Text strong className={"font-sans text-base font-normal"}>
            Account Address:
          </Text>
          <Text copyable className={"font-sans text-base font-normal"}>
            {account.address}
          </Text>

          <Button onClick={clearState}> Disconnect Wallet </Button>
        </Layout>
      </Content>
    </Card>
  )
}

export default Account
