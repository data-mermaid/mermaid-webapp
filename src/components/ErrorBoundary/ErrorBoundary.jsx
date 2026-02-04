import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withTranslation } from 'react-i18next'

import theme from '../../theme'
import { ButtonPrimary } from '../generic/buttons'
import { IconSync } from '../icons'

const StyledErrorBoundary = styled.div`
  background-color: ${theme.color.background};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 102;
  border: 1px;
`

const ErrorBoundaryContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const ErrorBoundaryPrimaryText = styled.span`
  font-weight: 700;
`

const ErrorBoundaryStatusContainer = styled.span`
  margin: 0 1rem 0 0;
`

const ErrorBoundaryStatus = styled.div`
  height: 9rem;
  width: 1rem;
  background-color: ${theme.color.cautionColor};
`

const ErrorButtonContainer = styled.span`
  min-width: 160px;
`

const ErrorButton = styled(ButtonPrimary)`
  margin-left: 5rem;
`

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMessage: '',
      attemptedRerender: false,
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { errorMessage: error.toString() }
  }

  // There is also potential to use the componentDidCatch() lifecycle method here if we want to do something with the error itself

  render() {
    const { errorMessage, attemptedRerender } = this.state
    const { children, t } = this.props

    if (errorMessage) {
      // Render a fallback UI
      // There is potential to pass this in as a property to make the error boundary customizable
      return (
        <StyledErrorBoundary>
          <ErrorBoundaryStatusContainer>
            <ErrorBoundaryStatus />
          </ErrorBoundaryStatusContainer>
          <ErrorBoundaryContentContainer>
            <ErrorBoundaryPrimaryText>{t('page.not_loaded')}</ErrorBoundaryPrimaryText>
            <p>
              {t('page.try_reloading')}{' '}
              <a target="_blank" href="https://datamermaid.org/contact-us" rel="noreferrer">
                {t('contact_us')}
              </a>
              .
            </p>
          </ErrorBoundaryContentContainer>
          <ErrorButtonContainer>
            {!attemptedRerender && (
              <ErrorButton
                onClick={() => {
                  this.setState({
                    errorMessage: '',
                    attemptedRerender: true,
                  })
                }}
              >
                <IconSync />
                <span> {t('try_again')}</span>
              </ErrorButton>
            )}
          </ErrorButtonContainer>
        </StyledErrorBoundary>
      )
    }

    return children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  t: PropTypes.func.isRequired,
}

export default withTranslation()(ErrorBoundary)
