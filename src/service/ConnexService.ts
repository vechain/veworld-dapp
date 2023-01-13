import { Connex } from "@vechain/connex"
import { Certificate } from "thor-devkit"
import { WalletSource, NetworkInfo, Network } from "../model/enums"

let connex: Connex | undefined

const initialise = (walletSource: WalletSource, network: Network) => {
  const enhancedNetwork = NetworkInfo[network]
  console.log(walletSource, network, enhancedNetwork)
  connex = new Connex({
    node: enhancedNetwork.url,
    network,
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
  const account = await connex.thor.account(accountAddress).get()
  return account
}

export default {
  getConnex,
  getAccount,
  initialise,
  clear,
}
