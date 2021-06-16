import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect, useMemo } from 'react'

import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'

const ManagementRegime = () => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  return (
    <ContentPageLayout
      content={<>Management</>}
      toolbar={
        <>
          <H2>Management Regime Name</H2>
        </>
      }
    />
  )
}

ManagementRegime.propTypes = {}

export default ManagementRegime
