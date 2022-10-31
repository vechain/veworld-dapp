import { configureStore } from "@reduxjs/toolkit"
import walletReducer from "./walletSlice"
import tokenReducer from "./tokenSlice"

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    token: tokenReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
