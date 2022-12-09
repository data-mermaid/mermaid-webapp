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

  // There is also potential to use the componentDidCatch() lifecycle method here if we want to do something with the error itself

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
