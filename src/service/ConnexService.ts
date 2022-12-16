import { Connex, Options } from "@vechain/connex"

let connex: Connex

const getConnex = async () => {
  if (!connex) await initConnex()

  return connex
}

const initConnex = async () => {
  const options: Options = {
    node: "https://vethor-node-test.vechaindev.com",
    network: "test",
  }

  connex = new Connex(options)
}

export default {
  getConnex,
}
