import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  getSelectedAccount,
  getWallet,
  selectAccount,
  updateAccounts,
  WalletAccount,
} from "../../store/walletSlice"
import { Alert, Button, Card, Select, Typography } from "antd"
import { getErrorMessage } from "../../utils/ExtensionUtils"

const { Text } = Typography

const ConnectToExtension: React.FC = () => {
  const wallet = useAppSelector(getWallet)
  const selectedAccount = useAppSelector(getSelectedAccount)

  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const dispatch = useAppDispatch()

  const connectHandler = async () => {
    if (!window.vechain) {
      return setError("VeChain extension not found")
    }

    try {
      await getAccounts()
    } catch (e) {
      console.error(e)
      setError(getErrorMessage(e))
    }
  }

  const getAccounts = async () => {
    if (!window.vechain) return

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

  const ErrorAlert = () => {
    if (error)
      return (
        <Alert
          description={error}
          type="error"
          showIcon
          onClick={() => setError(null)}
        />
      )

    if (warning)
      return (
        <Alert
          description={warning}
          type="warning"
          showIcon
          onClick={() => setWarning(null)}
        />
      )
    return <></>
  }

  return (
    <>
      <Card actions={error ? [<ErrorAlert key={"error"} />] : undefined}>
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
