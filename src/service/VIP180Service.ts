import CompiledVIP180 from "../artifacts/contracts/MyVIP180.sol/MyVIP180.json"
import ConnexService from "./ConnexService"
import { ClauseType } from "../model/Transaction"
import Web3 from "web3"
import VIP180Abi from "../vechain/VIP180.abi"
import { Connex } from "@vechain/connex"
import { Token } from "../store/tokenSlice"

const web3 = new Web3()

const buildDeployClause = (
  name: string,
  symbol: string
): Connex.Vendor.TxMessage => {
  const constructorParameters = web3.eth.abi
    .encodeParameters(["string", "string"], [name, symbol])
    .replace("0x", "")

  const byteCodeWithParameters = CompiledVIP180.bytecode + constructorParameters

  const deployClause: ClauseType = {
    data: byteCodeWithParameters,
    to: null,
    value: "0x0",
    abi: CompiledVIP180.abi,
  }

  return [deployClause]
}

export interface TokenReceiver {
  address: string
  amount: string
}

const buildMintClause = async (
  recipients: TokenReceiver[],
  tokenAddress: string
): Promise<Connex.Vendor.TxMessage> => {
  const connex = await ConnexService.getConnex()

  const clauses = []

  for (const recipient of recipients) {
    const clause = connex.thor
      .account(tokenAddress)
      .method(VIP180Abi.mint)
      .asClause(recipient.address, recipient.amount)

    clauses.push(clause)
  }

  return clauses
}

const getToken = async (address: string): Promise<Token> => {
  try {
    const connex = await ConnexService.getConnex()

    const token = connex.thor.account(address)

    const name = await token.method(VIP180Abi.name).call()
    const symbol = await token.method(VIP180Abi.symbol).call()
    const decimals = await token.method(VIP180Abi.decimals).call()

    return {
      address,
      name: name.decoded[0],
      symbol: symbol.decoded[0],
      decimals: decimals.decoded[0],
    }
  } catch (e) {
    console.error(e)
    throw Error("Failed to get VIP 180 token at address: " + address)
  }
}

const getBalance = async (address: string, tokenAddress: string) => {
  try {
    const connex = await ConnexService.getConnex()

    const token = connex.thor.account(tokenAddress)

    const balance = await token.method(VIP180Abi.balanceOf).call(address)

    return balance.decoded[0]
  } catch (e) {
    console.error(e)
    throw Error("Failed to get VIP 180 token balance")
  }
}

export default {
  buildDeployClause,
  buildMintClause,
  getToken,
  getBalance,
}
