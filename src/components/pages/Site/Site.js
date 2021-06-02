import { toast } from 'react-toastify'
import React, { useState, useEffect } from 'react'

import { H2 } from '../../generic/text'
import { ContentPageLayout } from '../../Layout'
import InputAutocomplete from '../../generic/InputAutocomplete'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'

const Site = () => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const [countryData, setCountryData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const _getSupportingData = useEffect(() => {
    let isMounted = true

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
          // Will update language file when adding user workflow like save/delete site to page.
          toast.error(`site error`)
        })
    }

    return () => {
      isMounted = false
    }
  }, [databaseSwitchboardInstance])

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

export default Site
