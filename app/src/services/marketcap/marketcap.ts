
interface IClient {
  fetchList: () => Promise<Asset[]>
}

export type Asset = {
  id: string
  name: string
  symbol: string
  priceUsd: number
}

export default class MarketCap {
  private client: IClient

  constructor(_client: IClient) {
    this.client = _client
  }

  public async getList(): Promise<any[]> {
    const marketcap = await this.client.fetchList()

    return marketcap || []
  }
}
