import React from 'react'
import styled from 'styled-components/macro'
import { Column } from '../../generic/positioning'
import theme from '../../../theme'
import language from '../../../language'

const PageUnavailableOfflineContainer = styled(Column)`
  padding: ${theme.spacing.medium};
  color: ${theme.color.primaryDisabledColor};
  font-style: italic;
`

const PageUnavailableOffline = () => {
  return (
    <PageUnavailableOfflineContainer>
      <p>{language.error.pageUnavailableOffline}</p>
    </PageUnavailableOfflineContainer>
  )
}

PageUnavailableOffline.propTypes = {}

export default PageUnavailableOffline
