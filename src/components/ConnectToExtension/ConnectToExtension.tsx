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
import ConnexService from "../../service/ConnexService"
import { Certificate } from "thor-devkit"

const { Text } = Typography

const ConnectToExtension: React.FC = () => {
  const wallet = useAppSelector(getWallet)
  const selectedAccount = useAppSelector(getSelectedAccount)

  const [waitingForExtension, setWaitingForExtension] = useState(false)
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

    try {
      const connex = await ConnexService.getConnex()

      setWaitingForExtension(true)

      const message: Connex.Vendor.CertMessage = {
        purpose: "identification",
        payload: {
          type: "text",
          content: "Sign a certificate to prove your identity",
        },
      }

      const certResponse = await connex.vendor
        .sign("cert", message)
        .link(window.location.href + "#/cert-callback/{certid}")
        .request()

      const cert: Certificate = {
        purpose: message.purpose,
        payload: message.payload,
        domain: certResponse.annex.domain,
        timestamp: certResponse.annex.timestamp,
        signer: certResponse.annex.signer,
        signature: certResponse.signature,
      }

      try {
        console.log("Signed cert", cert)
        Certificate.verify(cert)
        console.log("Cert verified")
      } catch (e) {
        console.error(e)
        setError(getErrorMessage(e))
      }

      const walletAccount: WalletAccount = {
        address: cert.signer,
        selected: true,
      }

      dispatch(updateAccounts([walletAccount]))
      dispatch(selectAccount(walletAccount.address))
    } catch (e) {
      console.error(e)
      setError(getErrorMessage(e))
    } finally {
      setWaitingForExtension(false)
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
            <Button id={"connectWalletButton"} onClick={connectHandler}>
              Connect to wallet
            </Button>
            {waitingForExtension && (
              <Alert
                message={`Waiting for response from VeWorld extension`}
                type={"warning"}
                showIcon
              />
            )}
          </>
        ) : (
          <>
            <Text strong>Select an account:</Text>
            <Select
              onChange={(key) => dispatch(selectAccount(key))}
              defaultValue={selectedAccount?.address}
            >
              {wallet.accounts.map((acc, index) => {
                return (
                  <Select.Option key={acc.address} value={acc.address}>
                    <Text id={`account-option-${index}`}>{acc.address}</Text>
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
