import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import PageUnavailableOffline from '../PageUnavailableOffline'

const Data = ({ databaseSwitchboardInstance }) => {
  const { _isOnlineAuthenticatedAndReady } = databaseSwitchboardInstance

  const content = _isOnlineAuthenticatedAndReady ? (
    <>Submitted Placeholder</>
  ) : (
    <PageUnavailableOffline />
  )

  return (
    <ContentPageLayout
      content={content}
      toolbar={
        <>
          <H2>Submitted</H2>
        </>
      }
    />
  )
}

Data.propTypes = {
  databaseSwitchboardInstance: PropTypes.shape({
    _isOnlineAuthenticatedAndReady: PropTypes.bool,
  }).isRequired,
}

export default Data
