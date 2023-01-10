import React, { useState } from "react"
import { Alert, Button, Card, Form, Radio } from "antd"
import { getErrorMessage } from "../../utils/ExtensionUtils"
import ConnexService, { Network } from "../../service/ConnexService"
import { Certificate } from "thor-devkit"
import { WalletSource } from "../../service/LocalStorageService"
import { IAccount } from "../../model/State"

interface ConnectForm {
  network: Network
  source: WalletSource
}

const DEFAULT_NETWORK = Network.TEST
const DEFAULT_SOURCE = WalletSource.VEWORLD

const ConnectToExtension: React.FC<{
  setAccount: (account: IAccount) => void
  setNetwork: (network: Network) => void
}> = ({ setAccount, setNetwork }) => {
  const [waitingForExtension, setWaitingForExtension] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [form] = Form.useForm<ConnectForm>()

  const connectHandler = async (form: ConnectForm) => {
    try {
      form.source = form.source || DEFAULT_SOURCE
      form.network = form.network || DEFAULT_NETWORK

      const connex = ConnexService.initialise(form.source, form.network)

      setWaitingForExtension(true)

      const message: Connex.Vendor.CertMessage = {
        purpose: "identification",
        payload: {
          type: "text",
          content: "Sign a certificate to prove your identity",
        },
      }

      const certResponse = await connex.vendor.sign("cert", message).request()

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

      setAccount({
        address: cert.signer,
        source: form.source,
      })
      setNetwork(form.network)
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
        <Form onFinish={connectHandler} form={form}>
          <Form.Item label="Network" name="network">
            <Radio.Group defaultValue={DEFAULT_NETWORK}>
              <Radio.Button value={Network.TEST}>Test Net</Radio.Button>
              <Radio.Button value={Network.MAIN}>Main Net</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Wallet" name="source">
            <Radio.Group defaultValue={DEFAULT_SOURCE}>
              <Radio.Button value={WalletSource.VEWORLD}>VeWorld</Radio.Button>
              <Radio.Button value={WalletSource.SYNC2}>Sync 2</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Button id={"connectWalletButton"} htmlType={"submit"}>
            Connect Wallet
          </Button>
        </Form>
        {waitingForExtension && (
          <Alert
            message={`Waiting for response from Wallet`}
            type={"warning"}
            showIcon
          />
        )}
      </Card>
    </>
  )
}

export default ConnectToExtension
