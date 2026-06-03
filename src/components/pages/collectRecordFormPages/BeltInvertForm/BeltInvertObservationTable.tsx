import React from 'react'

import { P } from '../../../generic/text'

interface BeltInvertObservationTableProps {
  testId?: string
  invertAttributes?: unknown[] // to be typed in a later phase
}

const BeltInvertObservationTable = ({
  testId = 'observations-section',
}: BeltInvertObservationTableProps) => {
  return <P data-testid={testId}>Observations table coming in Phase 3.2</P>
}

export default BeltInvertObservationTable
