import React from 'react'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'

import { TableValidationList } from './CollectingFormPage.Styles'
import ValidationMessage, { EditedNote } from '../../generic/ValidationMessage/ValidationMessage'
import ValidationMessageGroup from '../../generic/ValidationMessage/ValidationMessageGroup'
import { rowDisclosureKey } from '../../generic/ValidationMessage/ValidationDisclosure'
import InputIgnoreValidationWarningCheckboxWithLabel from '../../mermaidInputs/InputIgnoreValidationWarningCheckboxWithLabel'
import { getValidationMessage } from '../../../library/validationMessageHelpers'
import { isDuplicateValuesValidation } from './CollectRecordFormPage/getDuplicateValuesObservationIds'
import { Td } from '../../generic/Table/table'

// Wide enough for a pill, a short message and its Ignore box on one line, so a table with many
// input columns does not squeeze each word of a message onto its own line.
const ValidationsTd = styled(Td)`
  min-width: 36rem;
`

const ObservationValidationInfo = ({
  ignoreObservationValidations,
  observationId,
  unignoreObservationValidations,
  isObservationValid,
  observationValidationMessages,
}) => {
  const { t } = useTranslation()
  const isEdited = observationValidationMessages.some(({ isStale }) => isStale)

  // Each warning has its own box. The duplicate observations warning belongs to the record and
  // is marked on every row it names, so it is ignored at the top of the form, not from a row.
  const getIgnoreCheckbox = (message) => {
    const isWarning = message.status === 'warning' || message.status === 'ignore'

    if (!isWarning || isDuplicateValuesValidation(message)) {
      return null
    }

    const handleChange = (event) => {
      const change = event.target.checked
        ? ignoreObservationValidations
        : unignoreObservationValidations

      change({ observationId, validationId: message.id })
    }

    return (
      <InputIgnoreValidationWarningCheckboxWithLabel
        onChange={handleChange}
        checked={message.status === 'ignore'}
      />
    )
  }

  return (
    <ValidationsTd>
      {isObservationValid ? (
        <span aria-label={t('validations.passed')} data-testid="passed-validation-indicator">
          &nbsp;
        </span>
      ) : null}
      {observationValidationMessages.length ? (
        <ValidationMessageGroup
          disclosureKey={rowDisclosureKey(observationId)}
          messages={observationValidationMessages}
        >
          <TableValidationList>
            {observationValidationMessages.map((message) => (
              <li className={`${message.status}-indicator`} key={message.id}>
                <ValidationMessage
                  status={message.status}
                  isStale={message.isStale}
                  action={getIgnoreCheckbox(message)}
                >
                  {getValidationMessage(message)}
                </ValidationMessage>
              </li>
            ))}
          </TableValidationList>
        </ValidationMessageGroup>
      ) : null}
      {isEdited ? <EditedNote>{t('validations.edited_revalidate')}</EditedNote> : null}
    </ValidationsTd>
  )
}

ObservationValidationInfo.propTypes = {
  ignoreObservationValidations: PropTypes.func.isRequired,
  observationId: PropTypes.string.isRequired,
  unignoreObservationValidations: PropTypes.func.isRequired,
  isObservationValid: PropTypes.bool.isRequired,
  observationValidationMessages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
}

export default ObservationValidationInfo
