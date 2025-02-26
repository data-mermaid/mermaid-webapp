import React from 'react'
import PropTypes from 'prop-types'
import { useBlocker } from 'react-router-dom'
import useBeforeUnloadPrompt from '../../../library/useBeforeUnloadPrompt'
import language from '../../../language'

function Prompt({ shouldPromptTrigger = false, message }) {
  useBlocker(() => {
    if (shouldPromptTrigger) {
      // eslint-disable-next-line no-alert
      return !window.confirm(message)
    }

    return false
  })

  return <></>
}

Prompt.propTypes = {
  shouldPromptTrigger: PropTypes.bool,
}

const EnhancedPrompt = ({ shouldPromptTrigger = false }) => {
  // Capture browser navigation (will not capture front end/react router routing)
  useBeforeUnloadPrompt({ shouldPromptTrigger })

  // Display prompt for fornt end/react router routing
  return <Prompt shouldPromptTrigger={shouldPromptTrigger} message={language.navigateAwayPrompt} />
}

EnhancedPrompt.propTypes = {
  shouldPromptTrigger: PropTypes.bool,
}

Prompt.propTypes = {
  shouldPromptTrigger: PropTypes.bool,
  message: PropTypes.string.isRequired,
}

export default EnhancedPrompt
