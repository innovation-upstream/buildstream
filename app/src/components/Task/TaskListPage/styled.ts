import styled, { css } from 'styled-components'

export const StyledContainer = styled.div<{maxHeight?: number}>`
  ${({ maxHeight }) => css`
      @media (min-width: 768px) {
        max-height: ${maxHeight}px;
      }
  `}
`
