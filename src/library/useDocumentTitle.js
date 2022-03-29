// useDocumentTitle.js
import { useEffect } from 'react'

const useDocumentTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title

    document.title = title

    return () => {
      document.title = prevTitle
    }
  })
}

export default useDocumentTitle
