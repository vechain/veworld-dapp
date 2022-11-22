import { Connex } from "@vechain/connex"
import { ConnexOptions } from "@vechainfoundation/veworld-types/dist/model"

let connex: Connex
let options: ConnexOptions

const getConnex = async () => {
  if (!connex) await initConnex()

  return connex
}

const initConnex = async () => {
  if (!window.vechain || !window.vechain.isVeWorld)
    throw Error("Please install VeWorld extension")

  options = {
    node: "https://vethor-node-test.vechaindev.com",
    network: "test",
  }

  connex = await window.vechain.newConnex(options)
}

export default {
  getConnex,
}
