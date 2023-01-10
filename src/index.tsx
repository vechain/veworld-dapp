import React from "react"
import ReactDOM from "react-dom/client"

import reportWebVitals from "./reportWebVitals"

import CustomToast from "./components/CustomToast"
import { WalletProvider } from "./context/walletContext"
import Router from "./router"

import "./index.css"
import "react-toastify/dist/ReactToastify.css"
import NavBar from "./components/Layout/Navbar"
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <WalletProvider>
      <CustomToast />
      <div className={"w-full flex flex-col items-center justify-center"}>
        <NavBar />
        <div className={"max-w-6xl"}>
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
