/// <reference types="react-scripts" />
import WindowVeChain from "@vechainfoundation/veworld-types"

declare global {
  interface Window {
    vechain: WindowVeChain
  }
}
