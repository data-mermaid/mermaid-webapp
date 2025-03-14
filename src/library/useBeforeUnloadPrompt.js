import { useEffect } from 'react'

// note, this will not capture front end routing
const useBeforeUnloadPrompt = ({ shouldPromptTrigger }) => {
  useEffect(() => {
    const triggerPrompt = (event) => {
      if (shouldPromptTrigger) {
        // Useful reference: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
        // Prevent default behavior in Mozilla Firefox ensures prompt will be shown
        event.preventDefault()
        // Chrome requires returnValue to be set

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
