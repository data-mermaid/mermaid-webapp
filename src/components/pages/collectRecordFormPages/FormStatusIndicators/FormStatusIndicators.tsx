import React from 'react'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'
import theme from '../../../../theme'

type ChipVariant = 'error' | 'warning' | 'ignored'

const IndicatorBar = styled('div')`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
`

const chipStylesByVariant: Record<ChipVariant, { background: string; border: string }> = {
  error: { background: theme.color.chipErrorBackground, border: theme.color.chipErrorBorder },
  warning: { background: theme.color.chipWarningBackground, border: theme.color.chipWarningBorder },
  ignored: { background: theme.color.chipIgnoreBackground, border: theme.color.chipIgnoreBorder },
}

const Chip = styled('span')<{ $variant: ChipVariant }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  border-radius: 4px;
  font-size: ${theme.typography.defaultFontSize};
  background-color: ${(props) => chipStylesByVariant[props.$variant].background};
  border: ${theme.spacing.borderSmall} solid
    ${(props) => chipStylesByVariant[props.$variant].border};
`

interface FormStatusIndicatorsProps {
  errorCount: number
  warningCount: number
  ignoredCount: number
}

const FormStatusIndicators = ({
  errorCount,
  warningCount,
  ignoredCount,
}: FormStatusIndicatorsProps) => {
  const { t } = useTranslation()

  if (errorCount === 0 && warningCount === 0 && ignoredCount === 0) {
    return null
  }

  return (
    <IndicatorBar data-testid="form-status-indicators">
      {errorCount > 0 && (
        <Chip $variant="error" data-testid="form-status-chip-error">
          {t('sample_units.validation_status.chip_label_error', { count: errorCount })}
        </Chip>
      )}
      {warningCount > 0 && (
        <Chip $variant="warning" data-testid="form-status-chip-warning">
          {t('sample_units.validation_status.chip_label_warning', { count: warningCount })}
        </Chip>
      )}
      {ignoredCount > 0 && (
        <Chip $variant="ignored" data-testid="form-status-chip-ignored">
          {t('sample_units.validation_status.chip_label_ignored', { count: ignoredCount })}
        </Chip>
      )}
    </IndicatorBar>
  )
}

export default FormStatusIndicators
