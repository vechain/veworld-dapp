import React, { useState } from "react"
import LocalStorageService from "../../service/LocalStorageService"
import { ActionType, useWallet } from "../../context/walletContext"

import { Grid, GridItem } from "@chakra-ui/react"
import Welcome from "../../components/Homepage/Welcome/Welcome"
import Features from "../../components/Homepage/Features/Features"
import MeetVeWorld from "../../components/Homepage/MeetVeWorld/MeetVeWorld"
export interface Token {
  address?: string
  name?: string
  symbol?: string
  decimals?: number
}

const Homepage: React.FC = () => {
  const [token, setToken] = useState<Token | undefined>(
    LocalStorageService.getToken()
  )

  const {
    state: { account, network },
    dispatch,
  } = useWallet()

  const persistToken = (token: Token) => {
    setToken(token)
    LocalStorageService.setToken(token)
  }
  return (
    <Grid
      mt={20}
      w="full"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(5, 1fr)"
      gap={8}
      alignItems="stretch"
    >
      <GridItem rowSpan={1} colSpan={3}>
        <Welcome />
      </GridItem>
      <GridItem rowSpan={1} colSpan={2}>
        <MeetVeWorld />
      </GridItem>
      <GridItem rowSpan={1} colSpan={5}>
        <Features />
      </GridItem>

      {/* 
      {token?.address ? (
        <>
          <TokenBalance accountAddress={account.address} token={token} />
          <MintToken accountAddress={account.address} token={token} />
        </>
      ) : (
        <DeployToken setToken={persistToken} accountAddress={account.address} />
      )} */}
    </Grid>
  )
}

export default Homepage
