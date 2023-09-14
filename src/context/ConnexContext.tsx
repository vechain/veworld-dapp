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
import { LazyDriver } from "@vechain/connex/esm/driver"

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

const vendorFromSigner = (signer: Connex.Signer) => {
  return newVendor(new LazyDriver(Promise.resolve(signer)))
}

export const ConnexProvider: React.FC<IConnexProvider> = ({ children }) => {
  const {
    state: { account, network: selectedNetwork },
  } = useWallet()

  const { newWcSigner } = useWalletConnect()

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

        return vendorFromSigner(window.vechain.newConnexSigner(genesis.id))
      }
      case WalletSource.WALLET_CONNECT: {
        return vendorFromSigner(newWcSigner(genesis.id))
      }
    }
  }, [account.source, genesis, newWcSigner])

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
