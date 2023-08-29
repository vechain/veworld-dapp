/**
 * Types
 */
import { NetworkInfo, WalletSource } from "../model/enums"
import React, {
  createContext,
  MutableRefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react"
import { useWallet } from "./walletContext"
import { newThor } from "@vechain/connex-framework/dist/thor"
import { Driver, SimpleNet } from "@vechain/connex-driver"
import { genesisBlocks } from "@vechain/connex/esm/config"
import { Connex } from "@vechain/connex"
import { DriverVendorOnly } from "@vechain/connex/esm/driver"
import { newVendor } from "@vechain/connex-framework"
import { useWalletConnect } from "./walletConnectContext"

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

  const { newWcDriver } = useWalletConnect()

  const driver: MutableRefObject<Driver | undefined> = useRef()

  const networkInfo = useMemo(
    () => NetworkInfo[selectedNetwork],
    [selectedNetwork]
  )

  const genesis: Connex.Thor.Block | undefined = useMemo(
    () => genesisBlocks[selectedNetwork],
    [selectedNetwork]
  )

  const thor = useMemo(() => {
    if (driver.current?.genesis.id === genesis.id)
      return newThor(driver.current)

    const simpleNet = new SimpleNet(networkInfo.url)

    driver.current = new Driver(simpleNet, genesis)

    return newThor(driver.current)
  }, [networkInfo, genesis])

  const vendor = useCallback(() => {
    switch (account.source) {
      case WalletSource.SYNC2: {
        return newVendor(new DriverVendorOnly(genesis.id, false))
      }
      case WalletSource.VEWORLD: {
        if (!window.vechain) throw new Error("VeWorld extension not found")

        return newVendor(new DriverVendorOnly(genesis.id, true))
      }
      case WalletSource.WALLET_CONNECT: {
        const driver = newWcDriver(genesis.id)

        if (!driver)
          throw new Error(
            "WalletConnect session / client has not been established"
          )

        return newVendor(driver)
      }
    }
  }, [account.source, genesis, newWcDriver])

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
