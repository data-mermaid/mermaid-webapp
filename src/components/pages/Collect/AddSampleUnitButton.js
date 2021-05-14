import React from 'react'
import { useHistory } from 'react-router-dom'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import ButtonSecondaryDropdown from '../../generic/ButtonSecondaryDropdown'
import { Column } from '../../generic/positioning'
import { ButtonSecondary } from '../../generic/buttons'
import { IconPlus } from '../../icons'

const AddSampleUnitButton = () => {
  const history = useHistory()
  const currentProjectPath = useCurrentProjectPath()

  const routeChange = (transect) =>
    history.push(`${currentProjectPath}/collecting/${transect}`)

  const label = (
    <>
      <IconPlus /> Add Sample Unit
    </>
  )

  return (
    <ButtonSecondaryDropdown label={label}>
      <Column as="nav" data-testid="new-sample-unit-nav">
        <ButtonSecondary onClick={() => routeChange('fishbelt')}>
          Fish Belt
        </ButtonSecondary>
        <ButtonSecondary onClick={() => routeChange('benthiclit')} disabled>
          Benthic LIT
        </ButtonSecondary>
        <ButtonSecondary onClick={() => routeChange('benthiclit')} disabled>
          Benthic PIT
        </ButtonSecondary>
        <ButtonSecondary
          onClick={() => routeChange('habitatcomplexity')}
          disabled
        >
          Habitat Complexity
        </ButtonSecondary>
        <ButtonSecondary onClick={() => routeChange('bleaching')} disabled>
          Bleaching
        </ButtonSecondary>
      </Column>
    </ButtonSecondaryDropdown>
  )
}

export default AddSampleUnitButton
