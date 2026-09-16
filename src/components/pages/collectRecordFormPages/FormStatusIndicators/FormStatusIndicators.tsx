import React from 'react'
import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'
import theme from '../../../../theme'

// Matches the API's validation statuses. Only the chip label says "Ignored".
type ChipVariant = 'error' | 'warning' | 'ignore'

// Written out rather than built from the variant, so a key scan still finds them.
const CHIP_LABEL_KEYS: Record<ChipVariant, string> = {
  error: 'sample_units.validation_status.chip_label_error',
  warning: 'sample_units.validation_status.chip_label_warning',
  ignore: 'sample_units.validation_status.chip_label_ignored',
}

const IndicatorBar = styled('div')`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.small};
  /* Keeps the toolbar's buttons hard right whether or not this bar is showing. */
  margin-right: auto;
`

const chipBackgroundByVariant: Record<ChipVariant, string> = {
  error: theme.color.chipErrorBackground,
  warning: theme.color.chipWarningBackground,
  ignore: theme.color.chipIgnoreBackground,
}

const Chip = styled('span')<{ $variant: ChipVariant }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.medium};
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  border-radius: 5px;
  font-size: ${theme.typography.defaultFontSize};
  line-height: ${theme.typography.lineHeight};
  color: ${theme.color.textColor};
  background-color: ${(props) => chipBackgroundByVariant[props.$variant]};
  border: ${theme.spacing.borderSmall} solid ${theme.color.chipBorder};
`

// A small white bordered button, so it takes its colours from the secondary button family
// (see buttonSecondaryCss) rather than the design file's link blue, which falls below the
// contrast minimum at this size.
const NextButton = styled('button')`
  font-size: ${theme.typography.xSmallFontSize};
  font-weight: 600;
  text-transform: uppercase;
  padding: ${theme.spacing.small};
  border-radius: 2px;
  border: ${theme.spacing.borderSmall} solid ${theme.color.chipBorder};
  color: ${theme.color.secondaryText};
  background-color: ${theme.color.white};
  cursor: pointer;
  &:hover {
    background-color: ${theme.color.secondaryHover};
  }
`

// Next leaves focus on the chip so it can be pressed again, so where the page went is only
// available to a screen reader through the bar's live region.
const ScreenReaderOnly = styled('span')`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`

interface FormStatusIndicatorsProps {
  areValidationsShowing: boolean
  errorCount: number
  warningCount: number
  ignoredCount: number
  nextAnnouncement: string
  onNext: (type: ChipVariant) => void
}

const FormStatusIndicators = ({
  areValidationsShowing,
  errorCount,
  warningCount,
  ignoredCount,
  nextAnnouncement,
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

  const chips = [
    { variant: 'error', count: errorCount, labelKey: CHIP_LABEL_KEYS.error },
    { variant: 'warning', count: warningCount, labelKey: CHIP_LABEL_KEYS.warning },
    { variant: 'ignore', count: ignoredCount, labelKey: CHIP_LABEL_KEYS.ignore },
  ] as const

  return (
    <IndicatorBar data-testid="form-status-indicators" aria-live="polite">
      {chips
        .filter(({ count }) => count > 0)
        .map(({ variant, count, labelKey }) => {
          const chipLabel = t(labelKey, { count })

          return (
            <Chip key={variant} $variant={variant} data-testid={`form-status-chip-${variant}`}>
              {chipLabel}
              {/* Every chip has a Next button, so the label alone would name all three the
                  same thing to a screen reader. */}
              <NextButton
                type="button"
                onClick={() => onNext(variant)}
                aria-label={`${nextLabel}: ${chipLabel}`}
              >
                {nextLabel}
              </NextButton>
            </Chip>
          )
        })}
      <ScreenReaderOnly>{nextAnnouncement}</ScreenReaderOnly>
    </IndicatorBar>
  )
}

export default FormStatusIndicators
