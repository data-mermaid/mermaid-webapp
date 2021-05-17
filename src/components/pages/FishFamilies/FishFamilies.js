import React from 'react'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import PageUnavailableOffline from '../PageUnavailableOffline'
import { useOnlineStatus } from '../../../library/onlineStatusContext'

const FishFamilies = () => {
  const { isOnline } = useOnlineStatus()

  const content = isOnline ? (
    <>Fish Families Placeholder</>
  ) : (
    <PageUnavailableOffline />
  )

  return (
    <ContentPageLayout
      content={content}
      toolbar={
        <>
          <H2>Fish Families</H2>
        </>
      }
    />
  )
}

export default FishFamilies
