import React from 'react'
import styled from 'styled-components/macro'
import { H3 } from '../../generic/text'
import { Column } from '../../generic/positioning'

const PageUnavailableOfflineContainer = styled(Column)`
  align-items: center;
`

const PageUnavailableOffline = () => {
  return (
    <PageUnavailableOfflineContainer>
      <H3>This page is unavailable when offline</H3>
    </PageUnavailableOfflineContainer>
  )
}

PageUnavailableOffline.propTypes = {}

export default PageUnavailableOffline
