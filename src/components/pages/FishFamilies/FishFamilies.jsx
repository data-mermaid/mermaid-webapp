import React from 'react'
import { useTranslation } from 'react-i18next'
import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import PageUnavailable from '../PageUnavailable'
import { useOnlineStatus } from '../../../library/onlineStatusContext'

const FishFamilies = () => {
  const { t } = useTranslation()
  const { isAppOnline } = useOnlineStatus()

  const content = isAppOnline ? (
    <>Fish Families Placeholder</>
  ) : (
    <PageUnavailable mainText={t('offline.page_unavailable_offline')} />
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
