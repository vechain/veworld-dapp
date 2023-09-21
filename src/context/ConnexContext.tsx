/// <reference types="@vechain/connex-types" />
/**
 * Types
 */
import { NetworkInfo, WalletSource } from "../model/enums"
import React, { createContext, useCallback, useContext, useMemo } from "react"
import { useWallet } from "./WalletContext"
import { genesisBlocks } from "@vechain/connex/esm/config"
import { Connex } from "@vechain/connex"
import { newVendor } from "@vechain/connex-framework"
import { useWalletConnect } from "./WalletConnectContext"

declare global {
  interface Window {
    vechain: {
      newConnexSigner: (genesisId: string) => Connex.Signer
    }
  }
}

interface IContext {
  thor: Connex.Thor
  vendor: () => Connex.Vendor
}

/**
 * Context
 */
export const ConnexContext = createContext<IContext>({} as IContext)

interface IConnexProvider {
  children: React.ReactNode
}

export const ConnexProvider: React.FC<IConnexProvider> = ({ children }) => {
  const {
    state: { account, network: selectedNetwork },
  } = useWallet()

  const { wcSigner } = useWalletConnect()

  const networkInfo = useMemo(
    () => NetworkInfo[selectedNetwork],
    [selectedNetwork]
  )

  const genesis: Connex.Thor.Block | undefined = useMemo(
    () => genesisBlocks[selectedNetwork],
    [selectedNetwork]
  )

  const thor = useMemo(
    () =>
      new Connex.Thor({
        network: genesis,
        node: networkInfo.url,
      }),
    [networkInfo, genesis]
  )

  const vendor = useCallback(() => {
    switch (account.source) {
      case WalletSource.SYNC2: {
        return new Connex.Vendor(genesis.id, "sync2")
      }
      case WalletSource.VEWORLD_EXTENSION: {
        if (!window.vechain) throw new Error("VeWorld extension not found")

        return newVendor(window.vechain.newConnexSigner(genesis.id))
      }
      case WalletSource.WALLET_CONNECT: {
        return newVendor(wcSigner)
      }
    }
  }, [account.source, genesis, wcSigner])

  if (thor)
    return (
      <ConnexContext.Provider value={{ thor, vendor }}>
        {children}
      </ConnexContext.Provider>
    )

  return <></>
}

export function useConnex() {
  const context = useContext(ConnexContext)
  if (context === undefined) {
    throw new Error("useConnex must be used within a ConnexProvider")
  }
  return context
}
