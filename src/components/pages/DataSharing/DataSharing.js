import React from 'react'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'

const DataSharing = () => {
  const { isOnline } = useOnlineStatus()

  const content = isOnline ? (
    <>Data Sharing Placeholder</>
  ) : (
    <PageUnavailableOffline />
  )

  return (
    <ContentPageLayout
      content={content}
      toolbar={
        <>
          <H2>Data Sharing</H2>
        </>
      }
    />
  )
}

export default DataSharing
