import React from 'react'
import PropTypes from 'prop-types'
import { Prompt } from 'react-router-dom'
import useBeforeUnloadPrompt from '../../../library/useBeforeUnloadPrompt'
import language from '../../../language'

const EnhancedPrompt = ({ shouldPromptTrigger }) => {
  // Capture browser navigation (will not capture front end/react router routing)
  useBeforeUnloadPrompt({ shouldPromptTrigger })

  // Display prompt for fornt end/react router routing
  return (
      <Prompt
        when={shouldPromptTrigger}
        message={language.navigateAwayPrompt}
      />
  )
}

EnhancedPrompt.defaultProps = {
  shouldPromptTrigger: false
}

EnhancedPrompt.propTypes = {
  shouldPromptTrigger: PropTypes.bool
}

export default EnhancedPrompt
