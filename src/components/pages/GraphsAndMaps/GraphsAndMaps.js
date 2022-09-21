import React from 'react'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import language from '../../../language'
import PageUnavailable from '../PageUnavailable'
import { useOnlineStatus } from '../../../library/onlineStatusContext'

const GraphsAndMaps = () => {
  const { isAppOnline } = useOnlineStatus()

  const content = isAppOnline ? (
    <>Graphs and Maps Placeholder</>
  ) : (
    <PageUnavailable mainText={language.error.pageUnavailableOffline} />
  )

  return (
    <ContentPageLayout
      content={content}
      toolbar={
        <>
          <H2>Graphs and Maps</H2>
        </>
      }
    />
  )
}

export default GraphsAndMaps
