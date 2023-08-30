import { useState } from "react"
import { INonFungibleToken } from "../model/State"
import { useVip181 } from "./useVip181"
import { useConnex } from "../context/ConnexContext"

const useNFTBalance = () => {
  const [balance, setBalance] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const vip181 = useVip181()
  const { thor } = useConnex()

  const getNFTBalance = async (nft: INonFungibleToken, address: string) => {
    setLoading(true)
    setError(undefined)

    try {
      const newBalance = await vip181.getNftBalance(address, nft.address)

      console.log(`Account (${address}) NFT balance: ${newBalance}`)

      setBalance(newBalance)

      //Wait until the next block before returning
      await thor.ticker().next()
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
