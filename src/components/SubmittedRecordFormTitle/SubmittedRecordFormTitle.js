import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { getObjectById } from '../../library/getObjectById'
import { TooltipWithText } from '../generic/tooltip'
import {
  submittedFishBeltPropType,
  sitePropType,
} from '../../App/mermaidData/mermaidDataProptypes'

const TitleContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const SubmittedRecordFormTitle = ({ submittedRecord, sites }) => {
  const siteId = submittedRecord.sample_event?.site

  const defaultTitle = 'Fish Belt'
  const siteName =
    siteId && sites.length > 0 ? getObjectById(sites, siteId).name : ''
  const transectNumber = submittedRecord.fishbelt_transect?.number || ''
  const label = submittedRecord.fishbelt_transect?.label || ''

  return (
    <TitleContainer
      id="collect-form-title"
      data-testid="edit-collect-record-form-title"
    >
      <TooltipWithText
        as="h2"
        text={defaultTitle}
        tooltipText="Protocol"
        id="protocol-tooltip"
      />
      <TooltipWithText
        as="h2"
        text={siteName}
        tooltipText="Site Name"
        id="site-name-tooltip"
      />
      <TooltipWithText
        as="h2"
        text={transectNumber}
        tooltipText="Transect Number"
        id="transect-number-tooltip"
      />
      <TooltipWithText
        as="h2"
        text={label}
        tooltipText="Label"
        id="label-tooltip"
      />
    </TitleContainer>
  )
}

SubmittedRecordFormTitle.propTypes = {
  submittedRecord: submittedFishBeltPropType.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

export default SubmittedRecordFormTitle
