import React from "react"
import ReactDOM from "react-dom/client"

import reportWebVitals from "./reportWebVitals"

import CustomToast from "./components/CustomToast"
import { WalletProvider } from "./context/walletContext"
import Router from "./router"

import "./styles/index.css"
import "react-toastify/dist/ReactToastify.css"
import NavBar from "./components/Layout/Navbar"
import { ChakraProvider, Container } from "@chakra-ui/react"
import Fonts from "./styles/Fonts"
import theme from "./styles/Theme"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <WalletProvider>
        <CustomToast />
        <NavBar />
        <Container maxW="6xl" bg="blue.600" centerContent>
          <Router />
        </Container>
      </WalletProvider>
    </ChakraProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
