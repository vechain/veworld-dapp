import { Button, HStack, Text } from "@chakra-ui/react"
import React, { useCallback, useState } from "react"
import { useWallet } from "../../../context/walletContext"
import { IAccount, INonFungibleToken } from "../../../model/State"
import { Dialog } from "../../Shared"
import DeployNFT from "../DeployNFT/DeployNFT"
import MintNFT from "../MintNFT/MintNFT"
import NFTs from "../NFTs/NFTs"

interface IDeployTokenDialog {
  isOpen: boolean
  onClose: () => void
  account: IAccount
}

enum NFTsDialogView {
  NFTS,
  DEPLOY_NFT,
  MINT_NFT,
}

type ICurrentView =
  | { view: NFTsDialogView.NFTS; data?: INonFungibleToken }
  | { view: NFTsDialogView.DEPLOY_NFT }
  | { view: NFTsDialogView.MINT_NFT; data: INonFungibleToken }

const NFTsDialog: React.FC<IDeployTokenDialog> = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState<ICurrentView>({
    view: NFTsDialogView.NFTS,
  })

  const {
    state: { account },
  } = useWallet()

  if (!account) return <></>

  return (
    <Dialog
      isOpen={isOpen}
      showCloseButton={false}
      onClose={onClose}
      header={
        <NFTsDialogHeader
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      }
      body={
        <TokensDialogBody
          account={account}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      }
    />
  )
}

interface INFTsDialogHeader {
  currentView: ICurrentView
  setCurrentView: (data: ICurrentView) => void
}
const NFTsDialogHeader: React.FC<INFTsDialogHeader> = ({
  currentView,
  setCurrentView,
}) => {
  const { view } = currentView
  const isTokens = view === NFTsDialogView.NFTS
  const title =
    view === NFTsDialogView.DEPLOY_NFT
      ? "Deploy NFT"
      : view === NFTsDialogView.MINT_NFT
      ? `Mint NFT (${currentView.data.symbol})`
      : "Your NFTs"

  const goToDeployNft = useCallback(
    () => setCurrentView({ view: NFTsDialogView.DEPLOY_NFT }),
    [setCurrentView]
  )

  return (
    <HStack w="full" justify={"space-between"}>
      <Text>{title}</Text>
      {isTokens && (
        <Button
          onClick={goToDeployNft}
          colorScheme={"blue"}
          size="sm"
          variant={"solid"}
        >
          Deploy new NFT
        </Button>
      )}
    </HStack>
  )
}

interface INftsDialogBody extends INFTsDialogHeader {
  account: IAccount
}

const TokensDialogBody: React.FC<INftsDialogBody> = ({
  account,
  currentView,
  setCurrentView,
}) => {
  const openMintView = useCallback(
    (nft: INonFungibleToken) =>
      setCurrentView({ view: NFTsDialogView.MINT_NFT, data: nft }),
    []
  )

  const openNftsView = useCallback(
    (nft?: INonFungibleToken) =>
      setCurrentView({ view: NFTsDialogView.NFTS, data: nft }),
    []
  )

  if (currentView.view === NFTsDialogView.NFTS)
    return <NFTs selectedNft={currentView.data} openMintView={openMintView} />

  if (currentView.view === NFTsDialogView.DEPLOY_NFT)
    return <DeployNFT account={account} navigateBack={openNftsView} />

  if (currentView.view === NFTsDialogView.MINT_NFT)
    return <MintNFT nft={currentView.data} navigateBack={openNftsView} />

  return <></>
}

export default NFTsDialog
