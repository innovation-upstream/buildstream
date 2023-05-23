import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { MarketCap } from 'services/marketcap'
import CoincapClient from '../../../clients/external/coincap/coincap'

async function getMarketcap(req: NextApiRequest, res: NextApiResponse) {
  const marketcapService = new MarketCap(new CoincapClient())

  try {
    const marketcap = await marketcapService.getList()
    res.json({ marketcap })
  } catch (err: any) {
    console.error(err)
    if (err instanceof ApiError)
      return res.status(err.statusCode).send({ message: err.message })
    res.status(500).send({ message: 'Server error' })
  }
}

export default async function marketcap(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return getMarketcap(req, res)
    default:
      return res.status(405).send({ code: 405, message: 'Method not allowed' })
  }
}
