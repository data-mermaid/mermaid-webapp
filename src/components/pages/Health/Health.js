import React from 'react'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'

const Health = () => {
  const { isAppOnline } = useOnlineStatus()

  const content = isAppOnline ? (
    <>Project Health Placeholder</>
  ) : (
    <PageUnavailableOffline />
  )

  return (
    <ContentPageLayout
      content={content}
      toolbar={
        <>
          <H2>Project Health</H2>
        </>
      }
    />
  )
}

export default Health
