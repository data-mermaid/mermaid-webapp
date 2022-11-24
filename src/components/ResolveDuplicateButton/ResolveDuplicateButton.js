import React, { useState } from 'react'
import { InlineValidationButton } from '../pages/collectRecordFormPages/RecordLevelValidationInfo/RecordLevelValidationInfo'

const ResolveDuplicateButton = ({ isOpen, onDismiss }) => {
  const [isResolveDuplicateModalOpen, setIsResolveDuplicateModalOpen] = useState(false)

  return (
    <InlineValidationButton type="button" onClick={() => {}}>
      Resolve
    </InlineValidationButton>
  )
}

export default ResolveDuplicateButton
