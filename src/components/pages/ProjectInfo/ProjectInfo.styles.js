import styled, { css } from 'styled-components'

import { ButtonThatLooksLikeLink, CloseButton } from '../../generic/buttons'
import { hoverState } from '../../../library/styling/mediaQueries'
import { InputRow } from '../../generic/form'
import theme from '../../../theme'

export const SuggestNewOrganizationButton = styled(ButtonThatLooksLikeLink)`
  ${hoverState(css`
    background-color: ${theme.color.primaryColor};
    color: ${theme.color.white};
  `)}
`
export const TagStyleWrapper = styled.ul`
  padding: 0;
`
export const ClearTagButton = styled(CloseButton)`
  position: relative;
  color: ${theme.color.textColor};
  opacity: 0;
  transition: 0;
  &:focus {
    opacity: 1;
  }
  &:hover,
  &:focus {
    & + span {
      display: block;
    }
  }
`
export const TagStyle = styled.li`
  position: relative;
  color: ${theme.color.textColor};
  border-radius: 50px;
  background-color: ${theme.color.white};
  padding: 0 4rem 0 0;
  margin: 1rem 0.5rem;
  border: solid ${theme.spacing.borderMedium} ${theme.color.primaryColor};
  display: inline-block;
  white-space: nowrap;
  &:focus {
    ${ClearTagButton} {
      opacity: 1;
    }
  }
  ${hoverState(css`
    ${ClearTagButton} {
      opacity: 1;
    }
  `)}
  @media (hover: none) {
    ${ClearTagButton} {
      opacity: 1;
    }
  }
`

export const TooltipPopup = styled('span')`
  display: none;
  background: ${theme.color.primaryColor};
  color: ${theme.color.white};
  position: absolute;
  font-size: ${theme.typography.smallFontSize};
  clip-path: polygon(
    calc(20px - 10px) 15px,
    20px 0,
    calc(20px + 10px) 15px,
    100% 15px,
    100% 100%,
    0 100%,
    0 15px
  );
  padding: ${theme.spacing.small};
  padding-top: calc(4rem - 15px);
  top: 4rem;
  white-space: normal;
  text-align: start;
  line-height: ${theme.typography.lineHeight};
  z-index: 101;
  ${theme.typography.upperCase};
`
export const InputAutocompleteWrapper = styled(InputRow)`
  height: 100px;
`
export const BlockquoteInForm = styled.blockquote`
  margin: 0;
  background-color: ${theme.color.grey5};
  border-left: solid 4px ${theme.color.grey0};
  padding: ${theme.spacing.small};
`
