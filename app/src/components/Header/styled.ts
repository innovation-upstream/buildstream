import styled, { css } from 'styled-components'

export const Navbar = styled.nav`
  ${({ theme }) => css`
    background-color: ${theme.color.background.page.white};
    z-index: 5;
    color: ${theme.color.text.primary};
    top: 0;
    position: fixed;
    width: 100%;
    box-shadow: 0 5px 6px -6px ${theme.color.background.common.grey1};
  `}
`

export const ConnectWalletButton = styled.button.attrs({
  className: 'btn-outline'
})`
  ${({ theme }) => css`
    background-color: ${theme.color.background.common.white};
    color: ${theme.color.text.blue};
    border: 1px solid ${theme.color.background.button.primary};
    &:hover {
      background-color: ${theme.color.background.button.primary};
      color: ${theme.color.text.white};
    }
  `}
`
