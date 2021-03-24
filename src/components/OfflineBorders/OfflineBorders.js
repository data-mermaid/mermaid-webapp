import React from 'react'
import PropTypes from 'prop-types'
import { OfflineBordersStyle } from '../generic/borders'

const OfflineBorders = ({ isOffline }) => {
  return (
    isOffline && (
      <>
        <OfflineBordersStyle top />
        <OfflineBordersStyle right />
        <OfflineBordersStyle bottom />
        <OfflineBordersStyle left />
      </>
    )
  )
}

OfflineBorders.propTypes = {
  isOffline: PropTypes.bool.isRequired,
}

export default OfflineBorders
