import styled from 'styled-components'

export const StyledScrollableContainer = styled.div`
  scrollbar-color: rgba(26, 43, 93, 0.16) rgba(26, 43, 93, 0.08);
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(26, 43, 93, 0.08);
    border-radius: 100vw;
    margin-block: 0.5em;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(26, 43, 93, 0.16);
    border-radius: 100vw;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(26, 43, 93, 0.26);
  }
`
