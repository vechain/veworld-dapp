import { useState } from "react"
import { IToken } from "../model/State"
import { useVip180 } from "./useVip180"
import { useConnex } from "@vechain/dapp-kit-react"

const useTokenBalance = () => {
  const [balance, setBalance] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const vip180 = useVip180()
  const { thor } = useConnex()

  const getBalance = async (token: IToken, address: string) => {
    setLoading(true)
    setError(undefined)

    try {
      const newBalance = await vip180.getBalance(address, token.address)

      console.log(`Account (${address}) balance: ${newBalance}`)

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

  return { balance, getBalance, loading, error }
}

export default useTokenBalance
