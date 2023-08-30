import { SignClient } from "@walletconnect/sign-client/dist/types/client"
import { DEFAULT_METHODS } from "../../constants"
import { SessionTypes } from "@walletconnect/types"
import { DriverVendorOnly } from "@vechain/connex/esm/driver"
import { chainIdFromGenesis } from "../../utils/ChainUtil"
import { useRef } from "react"

type ClientRef = ReturnType<typeof useRef<SignClient>>
type SessionRef = ReturnType<typeof useRef<SessionTypes.Struct>>
type ConnectFn = (signClient: SignClient) => Promise<SessionTypes.Struct>

export class WalletConnectDriver extends DriverVendorOnly {
  private readonly chainId: string

  constructor(
    genesisId: string,
    private readonly signClient: ClientRef,
    private readonly session: SessionRef,
    private readonly connect: ConnectFn
  ) {
    super(genesisId, false)
    this.chainId = chainIdFromGenesis(genesisId)
  }

  get client(): SignClient {
    const client = this.signClient.current

    if (!client) throw new Error("Sign client is not established")

    return client
  }

  override async signTx(
    message: Connex.Vendor.TxMessage,
    options: Connex.Driver.TxOptions
  ): Promise<Connex.Vendor.TxResponse> {
    const sessionTopic = await this.getSessionTopic()

    return this.client.request({
      topic: sessionTopic,
      chainId: this.chainId,
      request: {
        method: DEFAULT_METHODS.REQUEST_TRANSACTION,
        params: [{ message, options }],
      },
    })
  }

  override async signCert(
    message: Connex.Vendor.CertMessage,
    options: Connex.Driver.CertOptions
  ): Promise<Connex.Vendor.CertResponse> {
    const sessionTopic = await this.getSessionTopic()

    return this.client.request({
      topic: sessionTopic,
      chainId: this.chainId,
      request: {
        method: DEFAULT_METHODS.SIGN_CERTIFICATE,
        params: [{ message, options }],
      },
    })
  }

  private async getSessionTopic(): Promise<string> {
    if (this.session.current) return this.session.current.topic

    const session = await this.connect(this.client)

    return session.topic
  }
}
