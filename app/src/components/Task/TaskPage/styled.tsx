import styled, { css } from 'styled-components'

interface ListItemProps {
  showLine?: boolean
}

export const StyledListItem = styled.li<ListItemProps>`
  ${({ showLine }) => css`
    ${showLine &&
    css`
      &:not(:last-child) {
        .iconContainer {
          &::before {
            content: '';
            position: absolute;
            // top: 50% + icon_container_height/2
            top: calc(50% + 18px);
            border-left: 1px dashed #c9c9c9;
            // height: 50% + icon_container_height/2 - list_item_margin_bottom
            height: 50%;

            @media (min-width: 1024px) {
              top: calc(50% + 20px);
            }
          }
        }
      }
      &:not(:first-child) {
        .iconContainer {
          &::after {
            content: '';
            position: absolute;
            top: 0;
            border-left: 1px dashed #c9c9c9;
            // top: 50% - icon_container_height/2
            height: calc(50% - 18px);

            @media (min-width: 1024px) {
              height: calc(50% - 20px);
            }
          }
        }
      }
    `}
  `}
`
