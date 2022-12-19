import { Connex, Options } from "@vechain/connex"

let connex: Connex

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

const getConnex = async () => {
  if (!connex) await initConnex()

  return connex
}

const initConnex = async () => {
  const options: Options = {
    node: "http://localhost:8669",
    network: soloGenesis,
  }

  connex = new Connex(options)
}

export default {
  getConnex,
}
