import React, { useState } from "react"
import { useAppSelector } from "../../store/hooks"
import { getToken } from "../../store/tokenSlice"
import { getSelectedAccount } from "../../store/walletSlice"
import { Content, Footer } from "antd/es/layout/layout"
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Layout,
  Row,
  Typography,
} from "antd"
import TransactionStatus from "../TransactionStatus/TransactionStatus"
import useFormEvents from "../../hooks/FormEvents"
import { TxStage } from "../../model/Transaction"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import VIP180Service from "../../service/VIP180Service"
import { toast } from "react-toastify"
import FormUtils from "../../utils/FormUtils"
import TransactionsService from "../../service/TransactionsService"
import { TokenReceiver } from "../../model/Token"
import { getErrorMessage } from "../../utils/ExtensionUtils"

const { Text } = Typography

interface MintTokenForm {
  receivers: TokenReceiver[]
}

const MintToken: React.FC = () => {
  const token = useAppSelector(getToken)
  const account = useAppSelector(getSelectedAccount)

  const [mintTokenForm] = Form.useForm<MintTokenForm>()
  const { onFormBlur, onFormFocus } = useFormEvents(mintTokenForm)

  const [txStatus, setTxStatus] = useState<TxStage>(TxStage.NONE)
  const [txId, setTxId] = useState<string | undefined>()
  const [error, setError] = useState<string | null>(null)

  if (!token.address || !account) return <></>

  const mintToken = async (form: MintTokenForm) => {
    setError(null)
    if (!token.address) return toast.error("Token address not found")
    if (form.receivers.length < 1) return toast.error("No receivers found")

    try {
      setTxStatus(TxStage.NONE)

      const clauses = await VIP180Service.buildMintClause(
        form.receivers,
        token.address
      )

      const clausesWithComments = clauses.map((clause) => {
        return { ...clause, comment: "Mint tokens" }
      })

      setTxStatus(TxStage.IN_EXTENSION)

      const { txid } = await TransactionsService.requestTransaction(
        account.address,
        clausesWithComments
      )
      setTxId(txid)
      setTxStatus(TxStage.POLLING_TX)

      const receipt = await TransactionsService.pollForReceipt(txid)

      if (receipt.reverted) {
        const revertReason = await TransactionsService.explainRevertReason(txid)
        setTxStatus(TxStage.REVERTED)
        return toast.error(revertReason)
      }

      setTxStatus(TxStage.COMPLETE)
      mintTokenForm.resetFields()
    } catch (e) {
      console.error(e)
      toast.error("Error minting token")
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
          txStage={txStatus}
          txId={txId}
          key={"txStatus"}
          setTxStage={setTxStatus}
        />
      )

    return actions
  }

  return (
    <Card className={"my-10"} actions={getActions()}>
      <Content className="h-full">
        <Form
          form={mintTokenForm}
          onFinish={mintToken}
          onFocusCapture={onFormFocus}
          onBlurCapture={onFormBlur}
          className="h-full"
        >
          <Layout className={"viewport"}>
            <Text className={"font-sans text-base font-normal"}>
              Mint tokens
            </Text>

            <MintTokenRecipient />
          </Layout>
          <Footer className="spacer-x">
            <Row>
              <Col>
                <Button type={"primary"} htmlType="submit">
                  Mint Tokens
                </Button>
              </Col>
            </Row>
          </Footer>
        </Form>
      </Content>
    </Card>
  )
}

const MintTokenRecipient: React.FC = () => {
  return (
    <Form.List name="receivers">
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field, index) => (
              <div key={field.key}>
                <Divider>Recipient {index + 1}</Divider>
                <Form.Item
                  name={[index, "address"]}
                  label="Receiver Address"
                  rules={[
                    {
                      required: true,
                      validator: FormUtils.validateAddress,
                      message: "Please input a valid address",
                    },
                  ]}
                >
                  <Input placeholder="VeChain Address" />
                </Form.Item>

                <Form.Item
                  name={[index, "amount"]}
                  label="Amount"
                  rules={[
                    {
                      required: true,
                      min: 1,
                      message: "Amount must be greater than 0",
                    },
                  ]}
                >
                  <Input placeholder="Amount of tokens" />
                </Form.Item>
                {fields.length > 1 ? (
                  <Button
                    danger={true}
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                    icon={<MinusCircleOutlined />}
                    style={{ width: "100%" }}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
            ))}
            <Divider />
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: "60%" }}
              >
                <PlusOutlined /> Add Recipient
              </Button>
            </Form.Item>
          </div>
        )
      }}
    </Form.List>
  )
}

export default MintToken
