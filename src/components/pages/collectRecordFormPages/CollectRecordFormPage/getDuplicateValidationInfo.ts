interface ValidationResult {
  code: string
  status: string
  context?: {
    duplicates?: Record<string, unknown[]>
  }
}

interface CollectRecord {
  validations?: {
    results?: {
      $record?: ValidationResult[]
    }
  }
}

const getDuplicateValidationInfo = (collectRecord: CollectRecord, imgId: string): boolean => {
  const recordValidationInfo = collectRecord?.validations?.results?.$record ?? []
  const duplicateRecordValidations = recordValidationInfo.find(
    (validation) => validation?.code === 'duplicate_images',
  )

  const duplicateValidationStatus = duplicateRecordValidations?.status
  const duplicates = duplicateRecordValidations?.context?.duplicates?.[imgId] ?? []

  return (
    duplicateValidationStatus !== 'ignore' && Array.isArray(duplicates) && duplicates.length > 0
  )
}

export default getDuplicateValidationInfo
