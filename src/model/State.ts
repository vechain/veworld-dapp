import { WalletSource } from "../service/LocalStorageService"

export interface IAccount {
  address: string
  source: WalletSource
}
