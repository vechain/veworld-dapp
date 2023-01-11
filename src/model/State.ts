import { WalletSource } from "./enums"

export interface IAccount {
  address: string
  source: WalletSource
}
