import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage/Homepage"
import "react-toastify/dist/ReactToastify.css"
import TxCallback from "./pages/TxCallback/TxCallback"
import Welcome from "./pages/Welcome/Welcome"

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/tx-callback/:txid" element={<TxCallback />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
