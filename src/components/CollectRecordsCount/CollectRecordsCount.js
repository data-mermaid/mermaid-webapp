import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import theme from '../../theme'
import { useDatabaseSwitchboardInstance } from '../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'

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

    databaseSwitchboardInstance.getCollectRecords().then((collectRecords) => {
      if (isMounted) {
        setCollectRecordsCount(collectRecords.length)
      }
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
