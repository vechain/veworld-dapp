import React from "react"
import ReactDOM from "react-dom/client"

import reportWebVitals from "./reportWebVitals"

import CustomToast from "./components/CustomToast"
import { WalletProvider } from "./context/walletContext"
import Router from "./router"

import "./index.css"
import "react-toastify/dist/ReactToastify.css"
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <WalletProvider>
      <CustomToast />
      <div className={"bg-gray-light h-screen w-screen"}>
        <div className={"bg-gray-lighter w-[750px] left-0 h-full"}>
          <Router />
        </div>
      </div>
    </WalletProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
