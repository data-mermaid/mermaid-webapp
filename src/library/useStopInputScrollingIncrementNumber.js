import { useEffect } from 'react'

export const useStopInputScrollingIncrementNumber = (inputRef) => {
  useEffect(() => {
    const handleWheel = (e) => e.target.blur()

    // we snapshot this so it doesnt complain about removing a different version of the ref
    // on unmount
    const snapshotOfRef = inputRef.current

    if (snapshotOfRef) snapshotOfRef.addEventListener('wheel', handleWheel)

    return () => {
      if (snapshotOfRef) snapshotOfRef.removeEventListener('wheel', handleWheel)
    }
  }, [inputRef])
}
