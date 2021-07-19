import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import language from '../../language'
import theme from '../../theme'

const CollectRecordsCountWrapper = styled.span`
  background: ${theme.color.cautionColor};
  border-radius: 50%;
  padding: 3px;
  color: ${theme.color.white};
  float: right;
  font-size: 1.4rem;
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
