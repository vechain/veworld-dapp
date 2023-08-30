import React from "react"
import ReactDOM from "react-dom/client"

import reportWebVitals from "./reportWebVitals"

import { WalletProvider } from "./context/WalletContext"
import Router from "./router"

import NavBar from "./components/Layout/Navbar"
import { ChakraProvider } from "@chakra-ui/react"
import Fonts from "./styles/Fonts"
import theme from "./styles/Theme"
import StyledContainer from "./components/Shared/StyledContainer/StyledContainer"

import "./styles/index.css"
import { WalletConnectProvider } from "./context/WalletConnectContext"
import { ConnexProvider } from "./context/ConnexContext"

const Index = () => {
  return (
    <>
      <Fonts />
      <ChakraProvider theme={theme}>
        <WalletProvider>
          <WalletConnectProvider>
            <ConnexProvider>
              <NavBar />
              <StyledContainer>
                <Router />
              </StyledContainer>
            </ConnexProvider>
          </WalletConnectProvider>
        </WalletProvider>
      </ChakraProvider>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
