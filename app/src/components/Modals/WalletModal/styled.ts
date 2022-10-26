import styled, { css } from 'styled-components'

export const ModalContent = styled.div.attrs({
  className:
    'border-0 rounded-3xl shadow-lg relative flex flex-col w-full h-full px-6 pb-5 outline-none focus:outline-none'
})`
  ${({ theme }) => css`
    background-color: ${theme.color.background.page.white};
  `}
`

export const ModalBody = styled.div.attrs({
  className: 'flex flex-col gap-y-4'
})`
  ${({ theme }) => css`
    color: ${theme.color.text.primary};
  `}
`

export const ModalItemWrapper = styled.div`
  ${({ theme }) => css`
    border-bottom: 1px solid ${theme.color.background.button.grey1};
    padding-bottom: 3px;
  `}
`

export const ModalBackDrop = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.color.background.page.black};
    opacity: 0.1;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    position: fixed;
  `}
`
