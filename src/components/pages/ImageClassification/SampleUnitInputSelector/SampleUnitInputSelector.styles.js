import styled from 'styled-components'
import theme from '../../../../theme'

const ButtonText = styled.span`
  margin-left: 0.8rem;
`

const ButtonContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`

const SelectorContainer = styled.div`
  padding: 1rem;
  background-color: ${theme.color.grey5};
  margin-left: 1rem;
  margin-top: 3rem;
`

const TextContainer = styled.div`
  max-width: 68rem;
`

const OfflineText = styled.p`
  color: ${theme.calloutDisabledText};
  padding-left: 1rem;
`

export { ButtonText, ButtonContainer, SelectorContainer, TextContainer, OfflineText }
