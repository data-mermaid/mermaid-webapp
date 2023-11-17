import React from 'react'
import PropTypes from 'prop-types'
import { useBlocker } from 'react-router-dom'
import useBeforeUnloadPrompt from '../../../library/useBeforeUnloadPrompt'
import language from '../../../language'

function Prompt({ when, message }) {
  const shouldBlock = when

  useBlocker(() => {
    if (shouldBlock) {
      // eslint-disable-next-line no-alert
      return !window.confirm(message)
    }

    return false
  })

  return <div key={shouldBlock} />
}

const EnhancedPrompt = ({ shouldPromptTrigger }) => {
  // Capture browser navigation (will not capture front end/react router routing)
  useBeforeUnloadPrompt({ shouldPromptTrigger })

  // Display prompt for fornt end/react router routing
  return (
    // <Prompt
    //   when={shouldPromptTrigger}
    //   message={language.navigateAwayPrompt}
    // />
    <div>foo</div>
  )
}

EnhancedPrompt.defaultProps = {
  shouldPromptTrigger: false,
}

EnhancedPrompt.propTypes = {
  shouldPromptTrigger: PropTypes.bool,
}

export default EnhancedPrompt
