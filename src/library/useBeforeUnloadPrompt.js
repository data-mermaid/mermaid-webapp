import { useEffect } from 'react'

// note, this will not capture front end routing
const useBeforeUnloadPrompt = ({ shouldPromptTrigger }) => {
  useEffect(() => {
    const triggerPrompt = (event) => {
      event.preventDefault()
      if (shouldPromptTrigger) {
        // eslint-disable-next-line no-param-reassign
        event.returnValue = ''
      }

      return event.returnValue
    }

    window.addEventListener('beforeunload', triggerPrompt)

    return () => {
      window.removeEventListener('beforeunload', triggerPrompt)
    }
  }, [shouldPromptTrigger])
}

export default useBeforeUnloadPrompt
