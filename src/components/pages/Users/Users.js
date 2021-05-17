import React from 'react'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'

const Users = () => {
  const { isOnline } = useOnlineStatus()

  const content = isOnline ? <>Users Placeholder</> : <PageUnavailableOffline />

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

export default Users
