import Web3 from "web3"

const web3 = new Web3()

const validateAddress = (_: unknown, value: string): Promise<void> => {
  if (web3.utils.isAddress(value)) return Promise.resolve()

  return Promise.reject(new Error("Invalid address"))
}

export default {
  validateAddress,
}
