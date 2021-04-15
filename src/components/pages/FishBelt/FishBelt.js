import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useHistory, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import {
  getSampleInfoInitialValues,
  getTransectInitialValues,
} from '../../../library/formikHelpers/collectRecordHelpers'
import { ButtonCallout } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { databaseSwitchboardPropTypes } from '../../../App/mermaidData/databaseSwitchboard'
import { H2 } from '../../generic/text'
import { RowRight } from '../../generic/positioning'
import language from '../../../language'
import FishBeltTransectInputs from '../../FishBeltTransectInputs'
import SampleInfoInputs from '../../SampleInfoInputs'
import EditCollectRecordFormTitle from '../../EditCollectRecordFormTitle'
import { ensureTrailingSlash } from '../../../library/strings/ensureTrailingSlash'

const FishBelt = ({ databaseSwitchboardInstance, isNewRecord }) => {
  const [choices, setChoices] = useState({})
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [managementRegimes, setManagementRegimes] = useState([])
  const [sites, setSites] = useState([])
  const { recordId } = useParams()
  const history = useHistory()

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance) {
      const promises = [
        databaseSwitchboardInstance.getSites(),
        databaseSwitchboardInstance.getManagementRegimes(),
        databaseSwitchboardInstance.getChoices(),
      ]

      if (recordId && !isNewRecord) {
        promises.push(databaseSwitchboardInstance.getCollectRecord(recordId))
      }
      Promise.all(promises)
        .then(
          ([
            sitesResponse,
            managementRegimesResponse,
            choicesResponse,
            collectRecordResponse,
          ]) => {
            setSites(sitesResponse)
            setManagementRegimes(managementRegimesResponse)
            setChoices(choicesResponse)
            setIsLoading(false)
            setCollectRecordBeingEdited(collectRecordResponse)
          },
        )
        .catch(() => {
          const error = isNewRecord
            ? language.error.collectRecordChoicesUnavailable
            : language.error.collectRecordUnavailable

          toast.error(error)
        })
    }
  }, [databaseSwitchboardInstance, recordId, isNewRecord])

  const collectRecordData = collectRecordBeingEdited?.data

  const reformatFormValuesIntoFishBeltRecord = (values) => {
    const {
      management,
      notes,
      sample_date,
      site,

      depth,
      label,
      len_surveyed,
      number,
      reef_slope,
      sample_time,
      size_bin,
      width,
    } = values

    return {
      ...collectRecordBeingEdited,
      data: {
        fishbelt_transect: {
          depth,
          label,
          len_surveyed,
          number,
          reef_slope,
          sample_time,
          size_bin,
          width,
        },
        sample_event: { management, notes, sample_date, site },
      },
    }
  }
  const formikOptions = {
    initialValues: {
      ...getSampleInfoInitialValues(collectRecordData, 'fishbelt_transect'),
      ...getTransectInitialValues(collectRecordData, 'fishbelt_transect'),
    },
    enableReinitialize: true,

    onSubmit: (values) => {
      const newRecord = reformatFormValuesIntoFishBeltRecord(values)

      databaseSwitchboardInstance
        .saveFishBelt(newRecord)
        .then((response) => {
          toast.success(language.success.collectRecordSave)
          if (isNewRecord) {
            history.push(
              `${ensureTrailingSlash(history.location.pathname)}${response.id}`,
            )
          }
        })
        .catch(() => {
          toast.error(language.error.collectRecordSave)
        })
    },
  }

  return (
    <Formik {...formikOptions}>
      {(formik) => (
        <ContentPageLayout
          isLoading={isLoading}
          content={
            <form
              id="fishbelt-form"
              aria-labelledby="fishbelt-form-title"
              onSubmit={formik.handleSubmit}
            >
              <SampleInfoInputs
                formik={formik}
                sites={sites}
                managementRegimes={managementRegimes}
              />
              <FishBeltTransectInputs formik={formik} choices={choices} />
            </form>
          }
          toolbar={
            <>
              {isNewRecord && <H2>Fish Belt</H2>}
              {collectRecordBeingEdited && !isNewRecord && (
                <EditCollectRecordFormTitle
                  collectRecord={collectRecordBeingEdited}
                  sites={sites}
                />
              )}

              <RowRight>
                <ButtonCallout type="submit" form="fishbelt-form">
                  Save
                </ButtonCallout>
              </RowRight>
            </>
          }
        />
      )}
    </Formik>
  )
}

FishBelt.propTypes = {
  databaseSwitchboardInstance: databaseSwitchboardPropTypes.isRequired,
  isNewRecord: PropTypes.bool,
}

FishBelt.defaultProps = {
  isNewRecord: true,
}

export default FishBelt
