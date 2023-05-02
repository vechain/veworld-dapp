import { Connex } from "@vechain/connex"
import { Certificate } from "thor-devkit"
import { Network, NetworkInfo, WalletSource } from "../model/enums"

let connex: Connex | undefined

const soloGenesis = {
  number: 0,
  id: "0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6",
  size: 170,
  parentID:
    "0xffffffff00000000000000000000000000000000000000000000000000000000",
  timestamp: 1526400000,
  gasLimit: 10000000,
  beneficiary: "0x0000000000000000000000000000000000000000",
  gasUsed: 0,
  totalScore: 0,
  txsRoot: "0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",
  txsFeatures: 0,
  stateRoot:
    "0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550",
  receiptsRoot:
    "0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0",
  signer: "0x0000000000000000000000000000000000000000",
  isTrunk: true,
  transactions: [],
}

const initialise = (walletSource: WalletSource, network: Network) => {
  const enhancedNetwork = NetworkInfo[network]
  console.log(walletSource, network, enhancedNetwork)
  connex = new Connex({
    node: enhancedNetwork.url,
    network: network === Network.SOLO ? soloGenesis : network,
    noExtension: walletSource === WalletSource.SYNC2,
  })

  return connex
}

const getConnex = () => {
  if (!connex) throw new Error("Connex not initialised")

  return connex
}

const clear = () => {
  connex = undefined
}

export const connectToWalletHandler = async (
  source: WalletSource,
  network: Network
): Promise<Certificate> => {
  const connex = initialise(source, network)

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

  console.log("Signed cert", cert)
  Certificate.verify(cert)
  console.log("Cert verified")

  return cert
}

const getAccount = async (
  accountAddress: string
): Promise<Connex.Thor.Account> => {
  const connex = getConnex()
  return await connex.thor.account(accountAddress).get()
}

export default {
  getConnex,
  getAccount,
  initialise,
  clear,
}
