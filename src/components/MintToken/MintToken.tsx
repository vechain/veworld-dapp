import React, { useState } from "react"
import { Content, Footer } from "antd/es/layout/layout"
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Typography,
} from "antd"
import TransactionStatus from "../TransactionStatus/TransactionStatus"
import useFormEvents from "../../hooks/FormEvents"
import { TxStage } from "../../model/Transaction"
import VIP180Service from "../../service/VIP180Service"
import { toast } from "react-toastify"
import FormUtils from "../../utils/FormUtils"
import TransactionsService from "../../service/TransactionsService"
import { getErrorMessage } from "../../utils/ExtensionUtils"
import { Token } from "../../pages/Homepage/Homepage"

const { Text } = Typography

interface MintTokenForm {
  address: string
  tokenAmount: number
  clauseAmount: number
}

const MintToken: React.FC<{ accountAddress: string; token: Token }> = ({
  accountAddress,
  token,
}) => {
  const [mintTokenForm] = Form.useForm<MintTokenForm>()
  const { onFormBlur, onFormFocus } = useFormEvents(mintTokenForm)

  const [txStatus, setTxStatus] = useState<TxStage>(TxStage.NONE)
  const [txId, setTxId] = useState<string | undefined>()
  const [error, setError] = useState<string | null>(null)

  const mintToken = async (form: MintTokenForm) => {
    setError(null)
    if (!token.address) return toast.error("Token address not found")

    try {
      setTxStatus(TxStage.NONE)

      const clauses = await VIP180Service.buildMintClause(
        form.address,
        form.tokenAmount,
        form.clauseAmount,
        token.address
      )

      //Random long paragraph of text
      const text =
        "The concept of Pragmatic Programming has become a reference term to the Programmers who are looking to hone their skills. Pragmatic Programming has been designed through real case analysis based on practical market experience. We have established a set of principles and concepts throughout this book that understand the characteristics and responsibilities of a Pragmatic Programmer."

      const clausesWithComments = clauses.map((clause) => {
        return { ...clause, comment: text }
      })

      setTxStatus(TxStage.IN_EXTENSION)

      const { txid } = await TransactionsService.requestTransaction(
        accountAddress,
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
          componentName={"Mint Token"}
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
                <Button
                  id={"mintTokensButton"}
                  type={"primary"}
                  htmlType="submit"
                >
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
    <>
      <Form.Item
        name={"address"}
        label="Receiver Address"
        rules={[
          {
            required: true,
            validator: FormUtils.validateAddress,
            message: "Please input a valid address",
          },
        ]}
      >
        <Input id={`recipient-address`} placeholder="VeChain Address" />
      </Form.Item>
      <Form.Item
        name={"tokenAmount"}
        label="Token Amount"
        rules={[
          {
            required: true,
            min: 1,
            message: "Amount must be greater than 0",
          },
        ]}
      >
        <Input id={`token-amount`} placeholder="Amount of tokens" />
      </Form.Item>

      <Form.Item
        name={"clauseAmount"}
        label="Number of Clauses"
        rules={[
          {
            required: true,
            min: 1,
            max: 100,
            message: "Must be between 1 and 100",
          },
        ]}
      >
        <Input id={`clause-amount`} placeholder="Amount of clauses" />
      </Form.Item>
    </>
  )
}

export default MintToken
