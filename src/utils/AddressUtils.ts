import { address } from "thor-devkit"
import HexUtils from "./HexUtils"

/**
 * Checks if two addresses are equal. Returns true if both values are strings AND:
 *  - The two values are equal OR
 *  - The checksumed addresses are equal
 *
 * @param address1
 * @param address2
 */
export const compareAddresses = (
  address1: unknown,
  address2: unknown
): boolean => {
  if (typeof address1 !== "string" || typeof address2 !== "string") return false

  if (address2 === address1) return true

  try {
    address1 = HexUtils.addPrefix(address1)
    address2 = HexUtils.addPrefix(address2)
    return (
      address.toChecksumed(address1 as string) ===
      address.toChecksumed(address2 as string)
    )
  } catch (e) {
    return false
  }
}

export const regexPattern = () => {
  return /^0x[a-fA-F0-9]{40}$/
}

export const isValid = (addr: string): boolean => {
  try {
    address.toChecksumed(HexUtils.addPrefix(addr))
    return true
  } catch (e) {
    return false
  }
}

export enum ExplorerLinkType {
  TRANSACTION = "TRANSACTION",
  ACCOUNT = "ACCOUNT",
}
