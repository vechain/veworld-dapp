import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { getSelectedAccount } from "../../store/walletSlice"
import VIP180Service from "../../service/VIP180Service"
import { TxStage } from "../../model/Transaction"
import { addToken, getToken } from "../../store/tokenSlice"
import { toast } from "react-toastify"
import { Alert, Button, Card, Form, Input, Layout, Row, Typography } from "antd"
import { Content, Footer } from "antd/es/layout/layout"
import useFormEvents from "../../hooks/FormEvents"
import TransactionStatus from "../TransactionStatus/TransactionStatus"
import TransactionsService from "../../service/TransactionsService"
import { getErrorMessage } from "../../utils/ExtensionUtils"

const { Text } = Typography

interface DeployTokenForm {
  tokenName: string
  tokenSymbol: string
  decimals: number
  delegateURL?: string
}

const DeployToken: React.FC = () => {
  const dispatch = useAppDispatch()
  const selectedAccount = useAppSelector(getSelectedAccount)
  const token = useAppSelector(getToken)

  const [txStatus, setTxStatus] = useState<TxStage>(TxStage.NONE)
  const [txId, setTxId] = useState<string | undefined>()
  const [deployTokenForm] = Form.useForm<DeployTokenForm>()
  const { onFormBlur, onFormFocus, generateAntClasses } =
    useFormEvents(deployTokenForm)
  const [error, setError] = useState<string | null>(null)

  if (!selectedAccount) return <></>

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

      const { txid } = await TransactionsService.requestTransaction(
        selectedAccount.address,
        clause,
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
      dispatch(addToken(token))

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
        {!token.address ? (
          <>
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
                    <Input name="tokenName" />
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
                    <Input name={"tokenSymbol"} />
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
                    <Input type={"number"} name={"decimals"} />
                  </Form.Item>
                  <Form.Item
                    label={"URL"}
                    className={generateAntClasses("delegateURL")}
                    name="delegateURL"
                    rules={[
                      {
                        required: false,
                        message: "Please enter a valid URL",
                      },
                    ]}
                  >
                    <Input type={"url"} name="delegateURL" />
                  </Form.Item>
                </Layout>
                <Footer className="spacer-x">
                  <Row>
                    <Button type={"primary"} htmlType="submit">
                      Deploy Token
                    </Button>
                  </Row>
                </Footer>
              </Form>
            </Content>
          </>
        ) : (
          <>
            <Text strong>Token name:</Text>
            <Text ellipsis>{token.name}</Text>
            <Text strong>Token Symbol</Text>
            <Text ellipsis>{token.symbol}</Text>
            <Text strong>Contract Decimals:</Text>
            <Text ellipsis>{token.decimals}</Text>
            <Text strong>Contract address:</Text>
            <Text copyable type="success" ellipsis>
              {token.address}
            </Text>
          </>
        )}
      </Card>
    </>
  )
}

export default DeployToken
