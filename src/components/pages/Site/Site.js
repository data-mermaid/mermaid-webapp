import { toast } from 'react-toastify'
import React, { useState, useEffect } from 'react'

import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import { databaseSwitchboardPropTypes } from '../../../App/mermaidData/databaseSwitchboard'
import InputAutocomplete from '../../generic/InputAutocomplete'

const Site = ({ databaseSwitchboardInstance }) => {
  const [countryData, setCountryData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const _getSupportingData = useEffect(() => {
    const isMounted = true

    if (databaseSwitchboardInstance) {
      const promises = [databaseSwitchboardInstance.getChoices()]

      Promise.all(promises)
        .then(([choicesResponse]) => {
          if (isMounted) {
            setCountryData(choicesResponse.countries.data)
            setIsLoading(false)
          }
        })
        .catch(() => {
          toast.error(`site error`)
        })
    }
  })

  const countryOptions = countryData.map(({ name, id }) => ({
    label: name,
    value: id,
  }))

  return (
    <ContentPageLayout
      isLoading={isLoading}
      content={
        <>
          <InputAutocomplete
            label="Country"
            id="country"
            options={countryOptions}
          />
        </>
      }
      toolbar={
        <>
          <H2>Site Name</H2>
        </>
      }
    />
  )
}

Site.propTypes = {
  databaseSwitchboardInstance: databaseSwitchboardPropTypes.isRequired,
}

export default Site
