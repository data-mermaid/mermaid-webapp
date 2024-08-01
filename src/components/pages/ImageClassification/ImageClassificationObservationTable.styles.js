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

export { StyledColgroup, IconContainer, ButtonContainer, StyledTd }
