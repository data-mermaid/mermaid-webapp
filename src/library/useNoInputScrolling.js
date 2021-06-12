import { useEffect } from 'react'

export const useNoInputScrolling = (inputRef) => {
  useEffect(() => {
    const handleWheel = (e) => e.preventDefault()
    // we snapshot this so it doesnt complain about removing a different version of the ref
    // on unmount
    const snapshotOfRef = inputRef.current

    snapshotOfRef.addEventListener('wheel', handleWheel)

    return () => {
      if (snapshotOfRef) snapshotOfRef.removeEventListener('wheel', handleWheel)
    }
  }, [inputRef])
}
