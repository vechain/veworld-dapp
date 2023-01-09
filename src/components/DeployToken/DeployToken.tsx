import React, { useState } from "react"
import VIP180Service from "../../service/VIP180Service"
import { TxStage } from "../../model/Transaction"
import { toast } from "react-toastify"
import { Alert, Button, Card, Form, Input, Layout, Row, Typography } from "antd"
import { Content, Footer } from "antd/es/layout/layout"
import useFormEvents from "../../hooks/FormEvents"
import TransactionStatus from "../TransactionStatus/TransactionStatus"
import TransactionsService from "../../service/TransactionsService"
import { getErrorMessage } from "../../utils/ExtensionUtils"
import { Token } from "../../pages/Homepage/Homepage"

const { Text } = Typography

interface DeployTokenForm {
  tokenName: string
  tokenSymbol: string
  decimals: number
  delegateURL?: string
}

const DeployToken: React.FC<{
  setToken: (token: Token) => void
  accountAddress: string
}> = ({ setToken, accountAddress }) => {
  const [txStatus, setTxStatus] = useState<TxStage>(TxStage.NONE)
  const [txId, setTxId] = useState<string | undefined>()
  const [deployTokenForm] = Form.useForm<DeployTokenForm>()
  const { onFormBlur, onFormFocus, generateAntClasses } =
    useFormEvents(deployTokenForm)
  const [error, setError] = useState<string | null>(null)

  if (!accountAddress) return <></>

  const deployToken = async (form: DeployTokenForm) => {
    setError(null)
    try {
      setTxId(undefined)
      setTxStatus(TxStage.NONE)

      const clause = VIP180Service.buildDeployClause(
        form.tokenName,
        form.tokenSymbol,
        form.decimals
      )

      setTxStatus(TxStage.IN_EXTENSION)

      const comment =
        "To become a Pragmatic Programmer, you need to think about what you are doing while you are doing it. It is not enough to do an isolated audit to get positive results, but to make it a habit to make a constant critical assessment of every decision you have made or intend to make. In other words, it is necessary to turn off the autopilot and to be present and aware of every action taken, to be constantly thinking and criticizing your work based on the Principles of Pragmatism.\n" +
        "\n"

      const { txid } = await TransactionsService.requestTransaction(
        accountAddress,
        clause,
        comment,
        form.delegateURL
      )
      setTxId(txid)
      setTxStatus(TxStage.POLLING_TX)

      const receipt = await TransactionsService.pollForReceipt(txid)

      if (receipt.reverted) {
        const revertReason = await TransactionsService.explainRevertReason(txid)
        setTxStatus(TxStage.REVERTED)
        return toast.error(revertReason)
      }

      const address = receipt.outputs[0].contractAddress as string
      const token = await VIP180Service.getToken(address)
      setToken(token)

      setTxStatus(TxStage.COMPLETE)
    } catch (e) {
      console.error(e)
      toast.error(
        "Transaction failed for some unknown reason. Last know status: " +
          txStatus
      )
      setTxStatus(TxStage.FAILURE)
      setError(getErrorMessage(e))
    }
  }

  const ErrorAlert = () => {
    if (error)
      return (
        <Alert
          description={error}
          type="error"
          showIcon
          onClick={() => {
            setError(null)
            setTxStatus(TxStage.NONE)
          }}
        />
      )
    return <></>
  }

  const getActions = () => {
    const actions = []

    if (error) actions.push(<ErrorAlert key={"error"} />)
    else if (txStatus !== TxStage.NONE)
      actions.push(
        <TransactionStatus
          componentName={"Deploy Token"}
          txStage={txStatus}
          txId={txId}
          key={"txStatus"}
          setTxStage={setTxStatus}
        />
      )

    return actions
  }

  return (
    <>
      <Card className={"my-10"} actions={getActions()}>
        <Content className="h-full">
          <Form
            form={deployTokenForm}
            onFinish={deployToken}
            onFocusCapture={onFormFocus}
            onBlurCapture={onFormBlur}
            className="h-full"
          >
            <Layout className={"viewport"}>
              <Text className={"font-sans text-base font-normal"}>
                Deploy a new token
              </Text>

              <Form.Item
                label={"Token Name"}
                className={generateAntClasses("tokenName")}
                name="tokenName"
                rules={[
                  {
                    required: true,
                    message: "Please enter a valid name",
                  },
                ]}
              >
                <Input id={"tokenNameInput"} name="tokenName" />
              </Form.Item>
              <Form.Item
                label={"Token Symbol"}
                className={generateAntClasses("tokenSymbol")}
                name="tokenSymbol"
                rules={[
                  {
                    required: true,
                    message: "Please enter a valid symbol",
                  },
                  {
                    min: 3,
                    max: 5,
                    message: "Symbol must be between 3 and 5 characters",
                  },
                ]}
              >
                <Input id={"tokenSymbolInput"} name={"tokenSymbol"} />
              </Form.Item>
              <Form.Item
                label={"Decimals"}
                className={generateAntClasses("decimals")}
                name="decimals"
                rules={[
                  {
                    required: true,
                    message:
                      "Please enter a number of decimals between 0 and 255",
                    min: 0,
                    max: 255,
                  },
                ]}
              >
                <Input id={"decimalsInput"} type={"number"} name={"decimals"} />
              </Form.Item>
              <Text>
                Sample URL: https://sponsor-testnet.vechain.energy/by/147
              </Text>
              <Form.Item
                label={"Delegation URL (Optional)"}
                className={generateAntClasses("delegateURL")}
                name="delegateURL"
                rules={[
                  {
                    required: false,
                    message: "Please enter a valid URL",
                  },
                ]}
              >
                <Input
                  id={"delegationUrlInput"}
                  type={"url"}
                  name="delegateURL"
                />
              </Form.Item>
            </Layout>
            <Footer className="spacer-x">
              <Row>
                <Button
                  id={"deployTokenButton"}
                  type={"primary"}
                  htmlType="submit"
                >
                  Deploy Token
                </Button>
              </Row>
            </Footer>
          </Form>
        </Content>
      </Card>
    </>
  )
}

export default DeployToken
