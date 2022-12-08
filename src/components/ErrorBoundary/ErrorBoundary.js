import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'

import theme from '../../theme'
import { ButtonPrimary } from '../generic/buttons'

const StyledErrorBoundary = styled.div`
  background-color: ${theme.color.background};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* height: 175px; */
  z-index: 102;
`

const StyledErrorButton = styled(ButtonPrimary)`
  margin-left: 20px;  
`

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { errorMessage: '' }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { errorMessage: error.toString() }
  }

  /* componentDidCatch(error, errorInfo) {
    // Uncaught errors will automatically be logged to the console by react
    // Could do something here like log the error to an error reporting service though
  }*/

  render() {
    const { errorMessage } = this.state
    const { children } = this.props

    if (errorMessage) {
      // Render a fallback UI
      // There is potential to pass this in as a property to make the error boundary customizable
      return <StyledErrorBoundary>
        <p>Something went wrong.</p>
        <StyledErrorButton
          onClick={() => this.setState({ errorMessage: '' })}
        >
          Try again
        </StyledErrorButton>
      </StyledErrorBoundary>
    }

    return children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
}

export default ErrorBoundary
