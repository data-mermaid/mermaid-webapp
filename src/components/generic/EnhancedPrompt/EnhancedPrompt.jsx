import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useBlocker } from 'react-router'
import { useTranslation } from 'react-i18next'
import useBeforeUnloadPrompt from '../../../library/useBeforeUnloadPrompt'

function Prompt({ shouldPromptTrigger = false, message }) {
  const blocker = useBlocker(shouldPromptTrigger)

  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (window.confirm(message)) {
        blocker.proceed()
      } else {
        blocker.reset()
      }
    }
  }, [blocker, message])

  return <></>
}

Prompt.propTypes = {
  shouldPromptTrigger: PropTypes.bool,
}

const EnhancedPrompt = ({ shouldPromptTrigger = false }) => {
  const { t } = useTranslation()
  // Capture browser navigation (will not capture front end/react router routing)
  useBeforeUnloadPrompt({ shouldPromptTrigger })

  // Display prompt for front end/react router routing
  return (
    <Prompt
      shouldPromptTrigger={shouldPromptTrigger}
      message={t('toasts.unsaved_work_confirmation')}
    />
  )
}

EnhancedPrompt.propTypes = {
  shouldPromptTrigger: PropTypes.bool,
}

Prompt.propTypes = {
  shouldPromptTrigger: PropTypes.bool,
  message: PropTypes.string.isRequired,
}

export default EnhancedPrompt
