import { BrowserRouter, Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage/Homepage"
import TxCallback from "./pages/TxCallback/TxCallback"

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/tx-callback/:txid" element={<TxCallback />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
