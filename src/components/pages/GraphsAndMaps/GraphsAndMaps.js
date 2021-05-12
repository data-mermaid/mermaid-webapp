import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import PageUnavailableOffline from '../PageUnavailableOffline'

const GraphsAndMaps = ({ databaseSwitchboardInstance }) => {
  const { _isOnlineAuthenticatedAndReady } = databaseSwitchboardInstance

  const content = _isOnlineAuthenticatedAndReady ? (
    <>Graphs and Maps Placeholder</>
  ) : (
    <PageUnavailableOffline />
  )

  return (
    <ContentPageLayout
      content={content}
      toolbar={
        <>
          <H2>Graphs and Maps</H2>
        </>
      }
    />
  )
}

GraphsAndMaps.propTypes = {
  databaseSwitchboardInstance: PropTypes.shape({
    _isOnlineAuthenticatedAndReady: PropTypes.bool,
  }).isRequired,
}

export default GraphsAndMaps
