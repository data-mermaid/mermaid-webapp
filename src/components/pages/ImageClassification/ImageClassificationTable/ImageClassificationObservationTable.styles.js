import styled from 'styled-components'
import { Td } from '../../../generic/Table/table'
import theme from '../../../../theme'

const StyledColgroup = styled('colgroup')`
  col {
    &.thumbnail {
      width: 5rem;
    }
    &.quadrat {
      width: 15rem;
    }
    &.benthicAttribute {
      width: auto;
    }
    &.growthForm {
      width: 20%;
    }
    &.numberOfPoints {
      width: 20rem;
    }
    &.validation {
      width: auto;
    }
    &.remove {
      width: 5rem;
    }
  }
`

const StyledTd = styled(Td)`
  padding: 0.5em !important;
  text-align: ${(props) => props.textAlign};
`

const IconContainer = styled('span')`
  margin-right: 0.8rem;
`

const ButtonContainer = styled.div`
  margin-left: 1rem;
`

const TdWithHoverText = styled(StyledTd)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => props.cursor};

  &::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%; /* Position above the cell */
    left: 50%;
    transform: translateX(-50%);
    background-color: ${theme.color.primaryColor};
    color: white;
    padding: 5px;
    white-space: nowrap;
    font-size: ${theme.typography.smallFontSize};
    z-index: 10;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s ease, visibility 0.5s ease;
  }

  &:hover {
    border: 2px solid ${theme.color.primaryColor};
  }

  &:hover::after {
    opacity: 1;
    visibility: visible;
  }
`

export { StyledColgroup, IconContainer, ButtonContainer, StyledTd, TdWithHoverText }
