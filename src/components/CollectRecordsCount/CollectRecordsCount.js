import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import language from '../../language'
import theme from '../../theme'
import { mediaQueryTabletLandscapeOnly } from '../../library/styling/mediaQueries'

const CollectRecordsCountWrapper = styled.strong`
  background: ${theme.color.calloutColor};
  border-radius: 100%;
  width: ${theme.spacing.large};
  height: ${theme.spacing.large};
  color: ${theme.color.white};
  float: right;
  display: grid;
  place-items: center;
  font-size: ${theme.typography.smallFontSize};
  ${mediaQueryTabletLandscapeOnly(css`
    float: none;
    margin: 0.5rem auto;
  `)}
`

const CollectRecordsCount = () => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const [collectRecordsCount, setCollectRecordsCount] = useState(0)

  const _getCollectRecordCount = useEffect(() => {
    let isMounted = true

    databaseSwitchboardInstance
      .getCollectRecords()
      .then((collectRecords) => {
        if (isMounted) {
          setCollectRecordsCount(collectRecords.length)
        }
      })
      .catch(() => {
        toast.warn(language.error.collectRecordsUnavailable)
      })

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance])

  return (
    !!collectRecordsCount && (
      <CollectRecordsCountWrapper>
        {collectRecordsCount}
      </CollectRecordsCountWrapper>
    )
  )
}

export default CollectRecordsCount
