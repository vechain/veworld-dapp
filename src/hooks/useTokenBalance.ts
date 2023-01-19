import { useState } from "react"
import { IToken } from "../model/State"
import ConnexService from "../service/ConnexService"
import VIP180Service from "../service/VIP180Service"

const useTokenBalance = () => {
  const [balance, setBalance] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const getBalance = async (token: IToken, address: string) => {
    setLoading(true)
    setError(undefined)

    try {
      const newBalance = await VIP180Service.getBalance(address, token.address)

      console.log(`Account (${address}) balance: ${newBalance}`)

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

  return { balance, getBalance, loading, error }
}

export default useTokenBalance
