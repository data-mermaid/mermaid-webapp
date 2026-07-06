import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  choicesPropType,
  submittedBeltInvertPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { SubmittedObservationStickyTable, Tr, Td } from '../../../generic/Table/table'
import { roundToOneDecimal } from '../../../../library/numbers/roundToOneDecimal'
import { TheadItem, FormSubTitle, UnderTableRow } from '../SubmittedFormPage.styles'
import { InputWrapper } from '../../../generic/form'
import { StyledOverflowWrapper } from '../../collectRecordFormPages/CollectingFormPage.Styles'
import { useBeltInvertDensityMetrics } from '../../../../library/macroinvertebrates/useBeltInvertDensityMetrics'
import MacroinvertebrateSummaryStats from '../../BeltInvert/MacroinvertebrateSummaryStats'
import { hasNonEmptyValue } from '../../../../library/hasNonEmptyValue'
import ViewNotesModal from './ViewNotesModal'
import styles from './SubmittedBeltInvertObservationTable.module.scss'

const SubmittedBeltInvertObservationTable = ({
  choices,
  invertAttributes,
  submittedRecord = undefined,
}) => {
  const { t } = useTranslation()
  const [notesModalObservationId, setNotesModalObservationId] = useState(null)
  const obs_belt_inverts = submittedRecord?.obs_belt_inverts ?? []
  const widthId = submittedRecord?.beltinvert_transect?.width
  const len_surveyed = submittedRecord?.beltinvert_transect?.len_surveyed ?? 0

  const { abundance, observationDensities, totalDensity, densityByGoi } =
    useBeltInvertDensityMetrics({
      observations: obs_belt_inverts,
      invertAttributes,
      choices,
      lenSurveyed: len_surveyed,
      widthId,
    })

  if (!submittedRecord) {
    return null
  }

  const notesModalObservation = notesModalObservationId
    ? obs_belt_inverts.find((o) => o.id === notesModalObservationId)
    : null

  const getInvertName = (invertAttributeId) => {
    const found = invertAttributes.find((invert) => invert.id === invertAttributeId)

    return found ? found.display_name ?? found.name : ''
  }

  const getInvertDensity = (item) => {
    return roundToOneDecimal(observationDensities.get(item.id))
  }

  const handleDismissNotesModal = () => {
    setNotesModalObservationId(null)
  }
  const hasSizeData = obs_belt_inverts.some((item) => hasNonEmptyValue(item.size))

  const observationBeltInverts = obs_belt_inverts.map((item, index) => (
    <Tr key={item.id}>
      <Td $align="center">{index + 1}</Td>
      <Td $align="left">{getInvertName(item.invert_attribute)}</Td>
      {hasSizeData && (
        <Td $align="right">{hasNonEmptyValue(item.size) ? roundToOneDecimal(item.size) : ''}</Td>
      )}
      <Td $align="right">{item.count}</Td>
      {item.notes?.trim() ? (
        <Td
          className={styles.clickableNotesTd}
          $align="left"
          role="button"
          tabIndex={0}
          aria-label={`View notes for row ${index + 1}`}
          onClick={() => setNotesModalObservationId(item.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setNotesModalObservationId(item.id)
            }
          }}
        >
          <span className={styles.notesCellText}>{item.notes}</span>
        </Td>
      ) : (
        <Td $align="left" />
      )}
      <Td $align="right">{getInvertDensity(item)}</Td>
    </Tr>
  ))

  return (
    <InputWrapper>
      <ViewNotesModal
        isOpen={notesModalObservationId !== null}
        notes={notesModalObservation?.notes ?? ''}
        invertAttributeName={
          notesModalObservation?.invert_attribute
            ? getInvertName(notesModalObservation.invert_attribute)
            : undefined
        }
        onDismiss={handleDismissNotesModal}
      />
      <FormSubTitle id="table-label">{t('observations.observations')}</FormSubTitle>
      <StyledOverflowWrapper>
        <SubmittedObservationStickyTable>
          <thead>
            <Tr>
              <TheadItem> </TheadItem>
              <TheadItem $align="left">{t('observations.macroinvertebrate_name')}</TheadItem>
              {hasSizeData && <TheadItem $align="right">{t('size_cm')}</TheadItem>}
              <TheadItem $align="right">{t('count')}</TheadItem>
              <TheadItem $align="left">{t('notes')}</TheadItem>
              <TheadItem $align="right">{`${t('density')} (${t(
                'measurements.individuals_per_hectare_short',
              )})`}</TheadItem>
            </Tr>
          </thead>
          <tbody>{observationBeltInverts}</tbody>
        </SubmittedObservationStickyTable>
      </StyledOverflowWrapper>
      <UnderTableRow>
        <MacroinvertebrateSummaryStats
          densityByGoi={densityByGoi}
          totalDensity={totalDensity}
          abundance={abundance}
        />
      </UnderTableRow>
    </InputWrapper>
  )
}

SubmittedBeltInvertObservationTable.propTypes = {
  choices: choicesPropType,
  invertAttributes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      display_name: PropTypes.string,
      group_of_interest: PropTypes.string,
    }),
  ),
  submittedRecord: submittedBeltInvertPropType,
}

export default SubmittedBeltInvertObservationTable
