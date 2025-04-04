import styled from 'styled-components'
import theme from '../../../../theme'

export const MapButtonContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  margin: ${theme.spacing.medium};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: ${theme.spacing.medium};
`
export const MapControlButton = styled('button')<{
  $isSelected?: boolean
}>`
  z-index: 1;
  cursor: pointer;
  border: ${(props) => (props.$isSelected ? `solid thin ${theme.color.white}` : 'none')};
  padding: ${(props) =>
    props.$isSelected
      ? '2px 5px'
      : '2px 7px'}; // keep the icon centered if border showing with box-sizing
  border-radius: ${theme.spacing.borderLarge};
  background-color: ${(props) =>
    props.$isSelected ? theme.color.primaryColor : theme.color.white};
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1); // copy maplibre button shadow
  color: ${(props) => (props.$isSelected ? theme.color.white : 'inherit')};
  box-sizing: border-box;
  height: 29px;
  width: 29px;
  &:hover {
    background-color: ${({ $isSelected }) =>
      $isSelected ? theme.color.primaryHover : theme.color.secondaryHover};
  }
`
export const ConnectedMapControlButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  & button {
    border-radius: 0;
  }

  & button:first-child {
    // remember the button is within a tooltip component
    border-top-left-radius: ${theme.spacing.borderLarge};
    border-top-right-radius: ${theme.spacing.borderLarge};
  }

  & button:last-child {
    border-bottom-left-radius: ${theme.spacing.borderLarge};
    border-bottom-right-radius: ${theme.spacing.borderLarge};
  }
`
