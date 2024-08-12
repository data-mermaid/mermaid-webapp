import styled from 'styled-components'
import { Td } from '../../generic/Table/table'

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
`

const IconContainer = styled('span')`
  margin-right: 0.8rem;
`

const ButtonContainer = styled.div`
  margin-left: 1rem;
`

const CenteredTd = styled(StyledTd)`
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%; /* Position above the cell */
    left: 50%;
    transform: translateX(-50%);
    background-color: black;
    color: white;
    padding: 5px;
    white-space: nowrap;
    font-size: 12px;
    z-index: 10;
  }
`

export { StyledColgroup, IconContainer, ButtonContainer, StyledTd, CenteredTd }
