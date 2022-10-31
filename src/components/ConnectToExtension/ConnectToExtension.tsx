import React from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  getSelectedAccount,
  getWallet,
  selectAccount,
  updateAccounts,
  WalletAccount,
} from "../../store/walletSlice"
import { Button, Card, Select, Typography } from "antd"

const { Text } = Typography

const ConnectToExtension: React.FC = () => {
  const wallet = useAppSelector(getWallet)
  const selectedAccount = useAppSelector(getSelectedAccount)

  const dispatch = useAppDispatch()

  const connectHandler = async () => {
    const accounts = await window.vechain.requestAccounts()

    if (accounts.length > 0) {
      const walletAccounts: WalletAccount[] = accounts.map(
        (address: string) => {
          return {
            address,
            selected: false,
          }
        }
      )

      dispatch(updateAccounts(walletAccounts))
      dispatch(selectAccount(walletAccounts[0].address))
    }
  }

  return (
    <>
      <Card>
        {wallet.accounts.length === 0 ? (
          <>
            <Text strong>Connect to VeWorld Extension</Text>
            <Button onClick={connectHandler}>Connect to wallet</Button>
          </>
        ) : (
          <>
            <Text strong>Select an account:</Text>
            <Select
              onChange={(key) => dispatch(selectAccount(key))}
              defaultValue={selectedAccount?.address}
            >
              {wallet.accounts.map((acc) => {
                return (
                  <Select.Option key={acc.address} value={acc.address}>
                    {acc.address}
                  </Select.Option>
                )
              })}
            </Select>
          </>
        )}
      </Card>
    </>
  )
}

export default ConnectToExtension
