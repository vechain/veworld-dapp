import CompiledVIP180 from "../artifacts/contracts/MyVIP180.sol/MyVIP180.json"
import { ClauseType } from "../model/Transaction"
import VIP180Abi from "../vechain/VIP180.abi"
import { scaleNumberUp } from "../utils/FormattingUtils"
import { IToken } from "../model/State"
import { useConnex } from "../context/ConnexContext"
import Web3 from "web3"

const web3 = new Web3()

export const useVip180 = () => {
  const { thor } = useConnex()

  const buildDeployClause = (
    name: string,
    symbol: string,
    decimals: number
  ): Connex.Vendor.TxMessage => {
    const constructorParameters = web3.eth.abi
      .encodeParameters(["string", "string", "uint8"], [name, symbol, decimals])
      .replace("0x", "")

    const byteCodeWithParameters =
      CompiledVIP180.bytecode + constructorParameters

    const deployClause: ClauseType = {
      data: byteCodeWithParameters,
      to: null,
      value: "0x0",
    }

    return [deployClause]
  }

  const buildMintClause = async (
    address: string,
    tokenAmount: number,
    clauseAmount: number,
    tokenAddress: string,
    tokenDecimals: number
  ): Promise<Connex.Vendor.TxMessage> => {
    const clauses = []

    for (let i = 0; i < clauseAmount; i++) {
      const clause = thor
        .account(tokenAddress)
        .method(VIP180Abi.mint)
        .asClause(address, scaleNumberUp(tokenAmount, tokenDecimals))

      clauses.push({
        ...clause,
        abi: VIP180Abi.mint,
      })
    }

    return clauses
  }

  const getToken = async (address: string): Promise<IToken> => {
    try {
      const token = thor.account(address)

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

  const getBalance = async (
    address: string,
    tokenAddress: string
  ): Promise<string> => {
    try {
      const balance = await thor
        .account(tokenAddress)
        .method(VIP180Abi.balanceOf)
        .call(address)

      return balance.decoded[0]
    } catch (e) {
      console.error(e)
      throw Error("Failed to get VIP 180 token balance")
    }
  }

  return {
    buildDeployClause,
    buildMintClause,
    getToken,
    getBalance,
  }
}
