import React from 'react'
import styled from 'styled-components'

import { bleachingRecordPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { FormSubTitle, TheadItem, UnderTableRow } from '../SubmittedFormPage.styles'
import { InputWrapper } from '../../../generic/form'
import { StyledOverflowWrapper } from '../../collectRecordFormPages/CollectingFormPage.Styles'
import { SubmittedObservationStickyTable, Td, Tr } from '../../../generic/Table/table'
import BleachingPercentCoverSummaryStats from '../../../BleachingPercentCoverSummaryStats/BleachingPercentCoverSummaryStats'

const StyledColgroup = styled('colgroup')`
  col {
    &.small-width {
      width: 5rem;
    }
    &.auto-width {
      width: auto;
    }
  }
`

const BleachingPercentCoverObservations = ({ record = [] }) => {
  const observationRows = record?.obs_quadrat_benthic_percent.map(
    ({ id, percent_hard, percent_soft, percent_algae, quadrat_number }, index) => (
      <Tr key={id}>
        <Td align="center">{index + 1}</Td>
        <Td align="center">{quadrat_number}</Td>
        <Td align="right">{percent_hard}</Td>
        <Td align="right">{percent_soft}</Td>
        <Td align="right">{percent_algae}</Td>
      </Tr>
    ),
  )

  return (
    <InputWrapper>
      <FormSubTitle id="table-label">Summary of Observations</FormSubTitle>
      <StyledOverflowWrapper>
        <SubmittedObservationStickyTable>
          <StyledColgroup>
            <col className="small-width" />
            <col className="auto-width" />
            <col className="auto-width" />
            <col className="auto-width" />
            <col className="auto-width" />
          </StyledColgroup>
          <thead>
            <Tr>
              <TheadItem> </TheadItem>
              <TheadItem align="center">Quadrat</TheadItem>
              <TheadItem align="right">Hard coral % cover</TheadItem>
              <TheadItem align="right">Soft coral % cover</TheadItem>
              <TheadItem align="right">Macroalgae % cover</TheadItem>
            </Tr>
          </thead>
          <tbody>{observationRows}</tbody>
        </SubmittedObservationStickyTable>
      </StyledOverflowWrapper>
      <UnderTableRow>
        {record.obs_quadrat_benthic_percent.length ? (
          <>
            <BleachingPercentCoverSummaryStats observations={record?.obs_quadrat_benthic_percent} />
          </>
        ) : (
          'No observations listed'
        )}
      </UnderTableRow>
    </InputWrapper>
  )
}

BleachingPercentCoverObservations.propTypes = {
  record: bleachingRecordPropType,
}

export default BleachingPercentCoverObservations
