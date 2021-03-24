import React from 'react'
import { OfflineBordersStyle } from '../generic/borders'

const OfflineBorders = () => {
  return (
    <>
      <OfflineBordersStyle top />
      <OfflineBordersStyle right />
      <OfflineBordersStyle bottom />
      <OfflineBordersStyle left />
    </>
  )
}

OfflineBorders.propTypes = {}

export default OfflineBorders
