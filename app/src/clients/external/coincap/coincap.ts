import { Asset } from 'services/marketcap/marketcap'

const url = 'https://api.coincap.io/v2/assets?limit=2000'

type CoincapAsset = {
  id: string
  rank: string
  symbol: string
  name: string
  supply: string
  maxSupply: string
  marketCapUsd: string
  volumeUsd24Hr: string
  priceUsd: string
  changePercent24Hr: string
  vwap24Hr: string
  explorer: string
}

type CoincapResponse = {
  data: CoincapAsset[]
}

export default class CoinCap {
  public url = url

  fetchList = async (): Promise<Asset[]> => {
    const response = await fetch(this.url)
    const data: CoincapResponse = await response.json()

    return data?.data?.map((asset) => ({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      priceUsd: parseFloat(asset.priceUsd)
    }))
  }
}
