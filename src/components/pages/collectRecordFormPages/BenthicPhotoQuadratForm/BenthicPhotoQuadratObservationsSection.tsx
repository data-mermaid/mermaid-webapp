import React, { ComponentProps } from 'react'

import { InputOption } from '../../../../App/mermaidData/mermaidDataTypes'
import { useOnlineStatus } from '../../../../library/onlineStatusContext'
import BenthicPhotoQuadratObservationTable from './BenthicPhotoQuadratObservationTable'
import BpqObservationTypeSelector from '../../ImageClassification/SampleUnitInputSelector/BpqObservationTypeSelector'
import ImageClassificationContainer from '../../ImageClassification/ImageClassificationTable/ImageClassificationContainer'
import ImageClassificationObservationsNotAvailableOfflineMessage from '../../ImageClassification/SampleUnitInputSelector/ImageClassificationObservationsNotAvailableOfflineMessage'

// CollectRecordFormPage passes the props for both observation tables; each table uses its own.
type ObservationTableProps = ComponentProps<typeof ImageClassificationContainer> &
  ComponentProps<typeof BenthicPhotoQuadratObservationTable>

type BenthicPhotoQuadratObservationsSectionProps = ObservationTableProps & {
  benthicAttributeSelectOptions: InputOption[]
  isNewRecord: boolean
  setIsImageClassificationSelected: (isImageClassificationSelected: boolean) => void
}

// Defined at module level so CollectRecordFormPage always gets the same component type.
// A new type would remount the subtree and discard an open image review window's unsaved work.
const BenthicPhotoQuadratObservationsSection = ({
  benthicAttributeSelectOptions,
  isNewRecord,
  setIsImageClassificationSelected,
  ...observationTableProps
}: BenthicPhotoQuadratObservationsSectionProps) => {
  const { isAppOnline } = useOnlineStatus()
  const { collectRecord, isImageClassificationEnabledForUser } = observationTableProps
  const doesRecordHaveImageClassificationData = collectRecord?.data?.image_classification

  if (!isAppOnline && doesRecordHaveImageClassificationData) {
    return <ImageClassificationObservationsNotAvailableOfflineMessage />
  }
  if (isNewRecord && isImageClassificationEnabledForUser) {
    return (
      <BpqObservationTypeSelector
        setIsImageClassificationSelected={setIsImageClassificationSelected}
        isAppOnline={isAppOnline}
      />
    )
  }
  if (!doesRecordHaveImageClassificationData) {
    return (
      <BenthicPhotoQuadratObservationTable
        benthicAttributeSelectOptions={benthicAttributeSelectOptions}
        {...observationTableProps}
      />
    )
  }

  return <ImageClassificationContainer {...observationTableProps} />
}

export default BenthicPhotoQuadratObservationsSection
