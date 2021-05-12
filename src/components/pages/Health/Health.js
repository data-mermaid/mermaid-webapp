import React from 'react'
import PropTypes from 'prop-types'
import { H3 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import PageUnavailableOffline from '../PageUnavailableOffline'

const Health = ({ databaseSwitchboardInstance }) => {
  const { _isOnlineAuthenticatedAndReady } = databaseSwitchboardInstance

  const content = _isOnlineAuthenticatedAndReady ? (
    <>Project Health Placeholder</>
  ) : (
    <PageUnavailableOffline />
  )

  return (
    <ContentPageLayout
      content={content}
      toolbar={
        <>
          <H3>Project Health</H3>
        </>
      }
    />
  )
}

Health.propTypes = {
  databaseSwitchboardInstance: PropTypes.shape({
    _isOnlineAuthenticatedAndReady: PropTypes.bool,
  }).isRequired,
}

export default Health
