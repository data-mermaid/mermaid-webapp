import React from 'react'
import styled from 'styled-components/macro'
import theme from '../../../../theme'
import { submittedBenthicPitPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { GenericStickyTable, Tr, Td } from '../../../generic/Table/table'
import {
  TheadItem,
  FormSubTitle,
  //   ObservationsSummaryStats,
  UnderTableRow,
} from '../SubmittedFormPage.styles'
import { InputWrapper } from '../../../generic/form'
import { StyledOverflowWrapper } from '../../collectRecordFormPages/CollectingFormPage.Styles'

const SubmittedObservationStickyTable = styled(GenericStickyTable)`
  @media (min-width: 1200px) {
    position: static;
    tr th {
      top: calc(${theme.spacing.headerHeight} + 13.3rem);
    }
  }
`
const SubmittedBenthicPitObservationTable = ({ submittedRecord }) => {
  const { obs_benthic_pits } = submittedRecord

  const observationsBenthicPit = obs_benthic_pits.map((item, index) => (
    <Tr key={item.id}>
      <Td align="center">{index + 1}</Td>
      <Td align="left">{item.interval}</Td>
      <Td align="right">{item.attribute}</Td>
      <Td align="right">{item.growth_form}</Td>
    </Tr>
  ))

  return (
    <InputWrapper>
      <FormSubTitle id="table-label">Observations</FormSubTitle>
      <StyledOverflowWrapper>
        <SubmittedObservationStickyTable>
          <thead>
            <Tr>
              <TheadItem> </TheadItem>
              <TheadItem align="left">Interval</TheadItem>
              <TheadItem align="right">Benthic Attribute</TheadItem>
              <TheadItem align="right">Growth Form</TheadItem>
            </Tr>
          </thead>
          <tbody>{observationsBenthicPit}</tbody>
        </SubmittedObservationStickyTable>
      </StyledOverflowWrapper>
      <UnderTableRow>
        {/* <ObservationsSummaryStats>
          <tbody>
            <Tr>
              <Th>{language.pages.collectRecord.totalBiomassLabel}</Th>
              <Td>{totalBiomass}</Td>
            </Tr>
            <Tr>
              <Th>{language.pages.collectRecord.totalAbundanceLabel}</Th>
              <Td>{totalAbundance}</Td>
            </Tr>
          </tbody>
        </ObservationsSummaryStats> */}
      </UnderTableRow>
    </InputWrapper>
  )
}

SubmittedBenthicPitObservationTable.propTypes = {
  submittedRecord: submittedBenthicPitPropType,
}

SubmittedBenthicPitObservationTable.defaultProps = {
  submittedRecord: undefined,
}

export default SubmittedBenthicPitObservationTable
