import styled from 'styled-components'
import { Td, Tr } from '../../../generic/Table/table'
import theme from '../../../../theme'
import { IMAGE_CLASSIFICATION_COLORS as COLORS } from '../../../../library/constants/constants'

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

const StyledTr = styled(Tr)`
  border-width: 0 0 0 ${theme.spacing.xsmall};
  border-style: solid;
  border-color: ${({ $messageType, $hasUnconfirmedPoint }) =>
    $messageType
      ? theme.color.getBorderColor($messageType)
      : $hasUnconfirmedPoint
      ? COLORS.unconfirmed
      : COLORS.confirmed};
`

const IconContainer = styled('span')`
  margin-right: 0.8rem;
`

const ButtonContainer = styled.div`
  margin-left: 1rem;
`

const ImageWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`

const TdWithHoverText = styled(StyledTd)`
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
    outline: 2px solid ${theme.color.primaryColor};
  }

  &:hover::after {
    opacity: 1;
    visibility: visible;
  }
`

export { StyledColgroup, IconContainer, ButtonContainer, StyledTd, TdWithHoverText, ImageWrapper }

