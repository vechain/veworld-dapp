import { Button, HStack, Text } from "@chakra-ui/react"
import React, { useCallback, useState } from "react"
import { IToken } from "../../../model/State"
import MintToken from "../MintToken/MintToken"
import { Dialog } from "../../Shared"
import DeployToken from "../DeployToken/DeployToken"
import Tokens from "../Tokens/Tokens"
import { useWallet } from "@vechain/dapp-kit-react"

interface IDeployTokenDialog {
  isOpen: boolean
  onClose: () => void
  account: string
}

enum TokensDialogView {
  TOKENS,
  DEPLOY_TOKEN,
  MINT_TOKEN,
}

type ICurrentView =
  | { view: TokensDialogView.TOKENS; data?: IToken }
  | { view: TokensDialogView.DEPLOY_TOKEN }
  | { view: TokensDialogView.MINT_TOKEN; data: IToken }

const TokensDialog: React.FC<IDeployTokenDialog> = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState<ICurrentView>({
    view: TokensDialogView.TOKENS,
  })

  const { account } = useWallet()

  if (!account) return <></>

  return (
    <Dialog
      isOpen={isOpen}
      showCloseButton={false}
      onClose={onClose}
      header={
        <TokensDialogHeader
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      }
      body={
        <TokensDialogBody
          accountAddress={account}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      }
    />
  )
}

interface ITokensDialogHeader {
  currentView: ICurrentView
  setCurrentView: (data: ICurrentView) => void
}

const TokensDialogHeader: React.FC<ITokensDialogHeader> = ({
  currentView,
  setCurrentView,
}) => {
  const isTokens = currentView.view === TokensDialogView.TOKENS

  const getTitle = useCallback(() => {
    const { view } = currentView
    if (view === TokensDialogView.DEPLOY_TOKEN) return "Deploy token"
    if (view === TokensDialogView.MINT_TOKEN)
      return `Mint Token (${currentView.data.symbol})`
    return "Your tokens"
  }, [currentView])

  const goToDeployToken = useCallback(
    () => setCurrentView({ view: TokensDialogView.DEPLOY_TOKEN }),
    [setCurrentView]
  )

  return (
    <HStack w="full" justify={"space-between"}>
      <Text>{getTitle()}</Text>
      {isTokens && (
        <Button
          onClick={goToDeployToken}
          colorScheme={"blue"}
          size="sm"
          variant={"solid"}
        >
          Deploy new token
        </Button>
      )}
    </HStack>
  )
}

interface ITokensDialogBody extends ITokensDialogHeader {
  accountAddress: string
}

const TokensDialogBody: React.FC<ITokensDialogBody> = ({
  accountAddress,
  currentView,
  setCurrentView,
}) => {
  const openMintView = useCallback(
    (token: IToken) =>
      setCurrentView({ view: TokensDialogView.MINT_TOKEN, data: token }),
    [setCurrentView]
  )

  const openTokensView = useCallback(
    (token?: IToken) =>
      setCurrentView({ view: TokensDialogView.TOKENS, data: token }),
    [setCurrentView]
  )

  if (currentView.view === TokensDialogView.TOKENS)
    return (
      <Tokens selectedToken={currentView.data} openMintView={openMintView} />
    )

  if (currentView.view === TokensDialogView.DEPLOY_TOKEN)
    return (
      <DeployToken
        accountAddress={accountAddress}
        navigateBack={openTokensView}
      />
    )

  if (currentView.view === TokensDialogView.MINT_TOKEN)
    return <MintToken token={currentView.data} navigateBack={openTokensView} />

  return <></>
}

export default TokensDialog
