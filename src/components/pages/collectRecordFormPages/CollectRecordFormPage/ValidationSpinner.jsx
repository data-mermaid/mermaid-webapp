import React from 'react'
import styled, { keyframes } from 'styled-components'
import { hoverState } from '../../../../library/styling/mediaQueries'

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const SpinnerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.color.backgroundColor};
  border: 1px solid ${(props) => props.theme.color.border};
  border-radius: 4px;
  font-size: ${(props) => props.theme.typography.smallFontSize};
  color: ${(props) => props.theme.color.textColor};
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  ${hoverState.desktop} {
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }
`

const Spinner = styled.div`
  border: 2px solid ${(props) => props.theme.color.border};
  border-top: 2px solid ${(props) => props.theme.color.primaryColor};
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: ${spin} 0.8s linear infinite;
`

const SpinnerText = styled.span`
  font-weight: 500;
`

/**
 * Non-blocking validation spinner that appears when validation is in progress
 *
 * @param {Object} props
 * @param {boolean} props.isValidating - Whether validation is currently running
 * @returns {JSX.Element|null}
 */
const ValidationSpinner = ({ isValidating }) => {
  if (!isValidating) {
    return null
  }

  return (
    <SpinnerContainer>
      <Spinner />
      <SpinnerText>Validating...</SpinnerText>
    </SpinnerContainer>
  )
}

export default ValidationSpinner
