import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"

export interface WalletAccount {
  address: string
  selected: boolean
}

export interface WalletState {
  accounts: WalletAccount[]
}

const initialState: WalletState = {
  accounts: [],
}

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    updateAccounts: (state, action: PayloadAction<WalletAccount[]>) => {
      state.accounts = action.payload
    },
    selectAccount: (state, action) => {
      state.accounts.forEach(
        (acc) => (acc.selected = acc.address === action.payload)
      )
    },
  },
})

export const { updateAccounts, selectAccount } = walletSlice.actions

export const getWallet = (state: RootState) => state.wallet

export const getSelectedAccount = (
  state: RootState
): WalletAccount | undefined => {
  return state.wallet.accounts.find((acc) => acc.selected)
}

export default walletSlice.reducer
