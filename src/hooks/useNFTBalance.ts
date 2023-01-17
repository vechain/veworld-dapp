import { useState } from "react"
import { INonFungibleToken } from "../model/State"
import ConnexService from "../service/ConnexService"
import VIP181Service from "../service/VIP181Service"

const useNFTBalance = () => {
  const [balance, setBalance] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const getNFTBalance = async (nft: INonFungibleToken, address: string) => {
    setLoading(true)
    setError(undefined)

    try {
      const newBalance = await VIP181Service.getNftBalance(address, nft.address)

      console.log(`Account (${address}) NFT balance: ${newBalance}`)

      setBalance(newBalance)

      //Wait until the next block before returning
      const connex = ConnexService.getConnex()
      await connex.thor.ticker().next()
      return newBalance
    } catch (e: unknown) {
      setError(e as string)
    } finally {
      setLoading(false)
    }
  }

  return { balance, getNFTBalance, loading, error }
}

export default useNFTBalance
