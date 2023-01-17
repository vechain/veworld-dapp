import CompiledVIP181 from "../artifacts/contracts/MyVIP181.sol/MyVIP181.json"
import ConnexService from "./ConnexService"
import { ClauseType } from "../model/Transaction"
import Web3 from "web3"
import VIP181Abi from "../vechain/VIP181.abi"
import { INonFungibleToken } from "../model/State"

const web3 = new Web3()

const buildNftDeployClause = (
  name: string,
  symbol: string,
  baseTokenURI: string
): Connex.Vendor.TxMessage => {
  const constructorParameters = web3.eth.abi
    .encodeParameters(
      ["string", "string", "string"],
      [name, symbol, baseTokenURI]
    )
    .replace("0x", "")

  const byteCodeWithParameters = CompiledVIP181.bytecode + constructorParameters

  const deployClause: ClauseType = {
    data: byteCodeWithParameters,
    to: null,
    value: "0x0",
  }

  return [deployClause]
}

const buildMintNftClause = async (
  address: string,
  nftAddress: string
): Promise<Connex.Vendor.TxMessage> => {
  const connex = await ConnexService.getConnex()
  const clauses = []

  const clause = connex.thor
    .account(nftAddress)
    .method(VIP181Abi.mint)
    .asClause(address)

  clauses.push({
    ...clause,
    abi: VIP181Abi.mint,
  })

  return clauses
}

const getNonFungibleToken = async (
  contractAddress: string
): Promise<INonFungibleToken> => {
  try {
    const connex = await ConnexService.getConnex()
    const nftContract = connex.thor.account(contractAddress)

    const name = await nftContract.method(VIP181Abi.name).call()
    const symbol = await nftContract.method(VIP181Abi.symbol).call()

    return {
      address: contractAddress,
      name: name.decoded[0],
      symbol: symbol.decoded[0],
      tokenURI: "",
    }
  } catch (e) {
    console.error(e)
    throw Error("Failed to get VIP-181 token at address: " + contractAddress)
  }
}

const getNftBalance = async (address: string, contractAddress: string) => {
  try {
    const connex = await ConnexService.getConnex()
    const nftContract = connex.thor.account(contractAddress)

    const balance = await nftContract.method(VIP181Abi.balanceOf).call(address)
    return balance.decoded[0]
  } catch (e) {
    console.error(e)
    throw Error("Failed to get VIP-181 NFT balance")
  }
}

export default {
  buildNftDeployClause,
  buildMintNftClause,
  getNonFungibleToken,
  getNftBalance,
}
