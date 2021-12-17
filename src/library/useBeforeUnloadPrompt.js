import { useEffect } from 'react'

const triggerPrompt = (event) => {
  event.preventDefault()
  // eslint-disable-next-line no-param-reassign
  event.returnValue = ''
}

// note, this will not capture front end routing
const useBeforeUnloadPrompt = () => {
  useEffect(() => {
    window.addEventListener('beforeunload', triggerPrompt)

    return () => {
      window.removeEventListener('beforeunload', triggerPrompt)
    }
  }, [])
}

export default useBeforeUnloadPrompt
