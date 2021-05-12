import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import PageUnavailableOffline from '../PageUnavailableOffline'

const Users = ({ databaseSwitchboardInstance }) => {
  const { _isOnlineAuthenticatedAndReady } = databaseSwitchboardInstance

  const content = _isOnlineAuthenticatedAndReady ? (
    <>Users Placeholder</>
  ) : (
    <PageUnavailableOffline />
  )

  return (
    <ContentPageLayout
      content={content}
      toolbar={
        <>
          <H2>Users</H2>
        </>
      }
    />
  )
}

Users.propTypes = {
  databaseSwitchboardInstance: PropTypes.shape({
    _isOnlineAuthenticatedAndReady: PropTypes.bool,
  }).isRequired,
}

export default Users
