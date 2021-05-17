import React from 'react'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'

const Data = () => {
  const { isOnline } = useOnlineStatus()

  const content = isOnline ? (
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

export default Data
