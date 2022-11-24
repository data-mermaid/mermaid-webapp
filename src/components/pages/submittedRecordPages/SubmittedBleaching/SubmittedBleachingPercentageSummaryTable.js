import React from 'react'
import { submittedBleachingPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { Tr, Td, Th } from '../../../generic/Table/table'
import { FormSubTitle, ObservationsSummaryStats, UnderTableRow } from '../SubmittedFormPage.styles'
import { InputWrapper } from '../../../generic/form'
import { getAverage } from '../../../../library/getAverage'

const SubmittedBleachingPercentageSummaryTable = ({ submittedRecord }) => {
  const { obs_quadrat_benthic_percent } = submittedRecord
  const hardPercentages = obs_quadrat_benthic_percent.map((item) => item.percent_hard)
  const softPercentages = obs_quadrat_benthic_percent.map((item) => item.percent_soft)
  const algaePercentages = obs_quadrat_benthic_percent.map((item) => item.percent_algae)
  const quadratCounts = obs_quadrat_benthic_percent.map((item) => item.quadrat_number)

  return (
    <InputWrapper>
      <FormSubTitle id="table-label">Summary of Observations</FormSubTitle>
      <UnderTableRow>
        {submittedRecord.obs_quadrat_benthic_percent.length ? (
          <ObservationsSummaryStats>
            <tbody>
              <Tr>
                <Th>Number of Quadrats</Th>
                <Td>{quadratCounts.length}</Td>
              </Tr>
              <Tr>
                <Th>Avg Hard Coral %</Th>
                <Td>{getAverage(hardPercentages)}</Td>
              </Tr>
              <Tr>
                <Th>Avg Soft Coral %</Th>
                <Td>{getAverage(softPercentages)}</Td>
              </Tr>
              <Tr>
                <Th>Avg Marcroalgae Cover %</Th>
                <Td>{getAverage(algaePercentages)}</Td>
              </Tr>
            </tbody>
          </ObservationsSummaryStats>
        ) : (
          'No observations listed'
        )}
      </UnderTableRow>
    </InputWrapper>
  )
}

SubmittedBleachingPercentageSummaryTable.propTypes = {
  submittedRecord: submittedBleachingPropType,
}

SubmittedBleachingPercentageSummaryTable.defaultProps = {
  submittedRecord: undefined,
}

export default SubmittedBleachingPercentageSummaryTable
