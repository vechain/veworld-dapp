import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import reportWebVitals from "./reportWebVitals"

import { HashRouter, Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage/Homepage"
import "react-toastify/dist/ReactToastify.css"
import CustomToast from "./components/CustomToast"
import TxCallback from "./pages/TxCallback/TxCallback"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <CustomToast />

    <div className={"bg-gray-light h-screen w-screen"}>
      <div className={"bg-gray-lighter w-[750px] left-0 h-full"}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/tx-callback/:txid" element={<TxCallback />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
