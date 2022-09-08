import React from 'react'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import language from '../../../language'
import PageNoData from '../PageNoData'
import { useOnlineStatus } from '../../../library/onlineStatusContext'

const FishFamilies = () => {
  const { isAppOnline } = useOnlineStatus()

  const content = isAppOnline ? (
    <>Fish Families Placeholder</>
  ) : (
    <PageNoData mainText={language.error.pageUnavailableOffline} />
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
