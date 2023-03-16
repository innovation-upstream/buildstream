import { Token } from './types'
import { tokens  } from './generated/tokens'

export const useToken = (token: string | number): Token | null | undefined => {
  return tokens.find((t) => t.id === token)
}

export const useTokens = (): Token[] => {
  return tokens
}
