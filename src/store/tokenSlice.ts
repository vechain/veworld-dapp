import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"

export interface Token {
  address?: string
  name?: string
  symbol?: string
  decimals?: number
}

const initialState: Token = {}

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    addToken: (state, action: PayloadAction<Token>) => {
      return action.payload
    },
  },
})

export const { addToken } = tokenSlice.actions

export const getToken = (state: RootState) => state.token

export default tokenSlice.reducer
