import { useEffect } from 'react'

export const useStopInputScrollingIncrementNumber = (inputRef) => {
  useEffect(() => {
    // Only native number inputs increment/decrement on scroll - a text input
    // (even one that only accepts numeric characters) has no such side effect.
    const handleWheel = (e) => {
      if (e.target.type === 'number') {
        e.target.blur()
      }
    }

    // we snapshot this so it doesnt complain about removing a different version of the ref
    // on unmount
    const snapshotOfRef = inputRef.current

    if (snapshotOfRef) {
      snapshotOfRef.addEventListener('wheel', handleWheel)
    }

    return () => {
      if (snapshotOfRef) {
        snapshotOfRef.removeEventListener('wheel', handleWheel)
      }
    }
  }, [inputRef])
}
