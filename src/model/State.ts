export interface IToken {
  address: string
  name: string
  symbol: string
  decimals: number
}

export interface INonFungibleToken {
  address: string
  name: string
  symbol: string
  tokenURI: string
}
