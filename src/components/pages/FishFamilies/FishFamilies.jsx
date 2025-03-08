import React from 'react'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import language from '../../../language'
import PageUnavailable from '../PageUnavailable'
import { useOnlineStatus } from '../../../library/onlineStatusContext'

const FishFamilies = () => {
  const { isAppOnline } = useOnlineStatus()

  const content = isAppOnline ? (
    <>Fish Families Placeholder</>
  ) : (
    <PageUnavailable mainText={language.error.pageUnavailableOffline} />
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
