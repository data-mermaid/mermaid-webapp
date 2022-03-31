import { useEffect } from 'react'

/**
 * Custom hook to apply a new title to the document with document.title.
 * Will remember the previous page title which will be re-applied when the component is unmounted.
 * NOTE: There are some potential pitfalls to this approach which are documented in this comment: https://github.com/data-mermaid/mermaid-webapp/pull/412#issuecomment-1081321094
 * @param {string} title The title to apply to the document
 */
const useDocumentTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title

    document.title = title

    return () => {
      document.title = prevTitle
    }
  }, [title])
}

export default useDocumentTitle
