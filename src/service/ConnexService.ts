import { Connex } from "@vechain/connex"

let connex: Connex

const getConnex = async () => {
  if (!connex) await initConnex()

  return connex
}

const initConnex = async () => {
  if (!window.vechain || !window.vechain.isVeWorld)
    throw Error("Please install VeWorld extension")

  connex = await window.vechain.getConnex()
}

export default {
  getConnex,
}
