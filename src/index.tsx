import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import reportWebVitals from "./reportWebVitals"
import { Provider } from "react-redux"
import { store } from "./store/store"

import { HashRouter, Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage/Homepage"
import "react-toastify/dist/ReactToastify.css"
import CustomToast from "./components/CustomToast"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CustomToast />

      <div className={"bg-gray-light h-screen w-screen"}>
        <div className={"bg-gray-lighter w-[750px] left-0 h-full"}>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/tx-callback/{txid}" element={<Homepage />} />
            </Routes>
          </HashRouter>
        </div>
      </div>
    </Provider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
