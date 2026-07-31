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
  gap: ${theme.spacing.small};
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  border-radius: 4px;
  font-size: ${theme.typography.defaultFontSize};
  background-color: ${(props) => chipStylesByVariant[props.$variant].background};
  border: ${theme.spacing.borderSmall} solid
    ${(props) => chipStylesByVariant[props.$variant].border};
`

const NextButton = styled('button')`
  font-size: ${theme.typography.smallFontSize};
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: ${theme.spacing.xxsmall} ${theme.spacing.xsmall};
  border-radius: 3px;
  border: ${theme.spacing.borderSmall} solid ${theme.color.primaryColor};
  color: ${theme.color.primaryColor};
  background-color: ${theme.color.white};
  cursor: pointer;
  &:hover {
    background-color: ${theme.color.primaryColor};
    color: ${theme.color.white};
  }
`

interface FormStatusIndicatorsProps {
  areValidationsShowing: boolean
  errorCount: number
  warningCount: number
  ignoredCount: number
  onNext: (type: ChipVariant) => void
}

const FormStatusIndicators = ({
  areValidationsShowing,
  errorCount,
  warningCount,
  ignoredCount,
  onNext,
}: FormStatusIndicatorsProps) => {
  const { t } = useTranslation()

  if (!areValidationsShowing) {
    return null
  }

  if (errorCount === 0 && warningCount === 0 && ignoredCount === 0) {
    return null
  }

  const nextLabel = t('sample_units.validation_status.next')

  return (
    <IndicatorBar data-testid="form-status-indicators">
      {errorCount > 0 && (
        <Chip $variant="error" data-testid="form-status-chip-error">
          {t('sample_units.validation_status.chip_label_error', { count: errorCount })}
          <NextButton type="button" onClick={() => onNext('error')} aria-label={nextLabel}>
            {nextLabel}
          </NextButton>
        </Chip>
      )}
      {warningCount > 0 && (
        <Chip $variant="warning" data-testid="form-status-chip-warning">
          {t('sample_units.validation_status.chip_label_warning', { count: warningCount })}
          <NextButton type="button" onClick={() => onNext('warning')} aria-label={nextLabel}>
            {nextLabel}
          </NextButton>
        </Chip>
      )}
      {ignoredCount > 0 && (
        <Chip $variant="ignored" data-testid="form-status-chip-ignored">
          {t('sample_units.validation_status.chip_label_ignored', { count: ignoredCount })}
          <NextButton type="button" onClick={() => onNext('ignored')} aria-label={nextLabel}>
            {nextLabel}
          </NextButton>
        </Chip>
      )}
    </IndicatorBar>
  )
}

export default FormStatusIndicators
