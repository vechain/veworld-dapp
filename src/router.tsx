import { HashRouter, Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage/Homepage"
import "react-toastify/dist/ReactToastify.css"
import TxCallback from "./pages/TxCallback/TxCallback"

const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/tx-callback/:txid" element={<TxCallback />} />
      </Routes>
    </HashRouter>
  )
}

export default Router
