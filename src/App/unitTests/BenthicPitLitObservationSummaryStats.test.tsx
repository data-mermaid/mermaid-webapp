import { describe, expect, it } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BenthicPitLitObservationSummaryStats from '../../components/BenthicPitLitObservationSummaryStats'

const benthicAttributeSelectOptions = [
  { value: 'attr1', label: 'Attribute 1', topLevelCategory: 'cat1' },
  { value: 'attr2', label: 'Attribute 2', topLevelCategory: 'cat2' },
  { value: 'cat1', label: 'Category 1', topLevelCategory: '' },
  { value: 'cat2', label: 'Category 2', topLevelCategory: '' },
]

describe('BenthicPitLitObservationSummaryStats', () => {
  it('renders correct percentages for LIT observations', () => {
    const observations = [
      { attribute: 'attr1', growth_form: 'form1', id: '1', length: 10 },
      { attribute: 'attr1', growth_form: 'form1', id: '2', length: 20 },
      { attribute: 'attr2', growth_form: 'form2', id: '3', length: 10 },
    ]
    render(
      <BenthicPitLitObservationSummaryStats
        benthicAttributeSelectOptions={benthicAttributeSelectOptions}
        observations={observations}
        recordType={'lit'}
      />,
    )
    expect(screen.getByText('% Category 1')).toBeInTheDocument()
    const category1 = screen.getByText('75.0') // (10+20)/40*100 = 75.0
    expect(category1).toBeInTheDocument()
    expect(screen.getByText('% Category 2')).toBeInTheDocument()
    const category2 = screen.getByText('25.0') // 10/40*100 = 25.0
    expect(category2).toBeInTheDocument()
  })

  it('renders correct percentages for PIT observations', () => {
    const observations = [
      { attribute: 'attr1', growth_form: 'form1', id: '1', interval: '2.0', interval_size: 2 },
      { attribute: 'attr1', growth_form: 'form1', id: '2', interval: '4.0', interval_size: 2 },
      { attribute: 'attr2', growth_form: 'form2', id: '3', interval: '6.0', interval_size: 2 },
    ]
    render(
      <BenthicPitLitObservationSummaryStats
        benthicAttributeSelectOptions={benthicAttributeSelectOptions}
        observations={observations}
        recordType={'pit'}
      />,
    )
    expect(screen.getByText('% Category 1')).toBeInTheDocument()
    expect(screen.getByText('66.7')).toBeInTheDocument() // 2/3*100 = 66.7
    expect(screen.getByText('% Category 2')).toBeInTheDocument()
    expect(screen.getByText('33.3')).toBeInTheDocument() // 1/3*100 = 33.3
  })

  it('will show "missing attribute" of 100.0 percent if no observations with attributes are present on a PIT record', () => {
    render(
      <BenthicPitLitObservationSummaryStats
        benthicAttributeSelectOptions={benthicAttributeSelectOptions}
        observations={[{ attribute: '', growth_form: '', id: '1' }]}
        recordType={'pit'}
      />,
    )
    expect(screen.getByText('100.0')).toBeInTheDocument() // Missing category will be 100.0%
  })

  it('will show "missing attribute" of 100.0 percent if no observations with attributes are present on a LIT record', () => {
    render(
      <BenthicPitLitObservationSummaryStats
        benthicAttributeSelectOptions={benthicAttributeSelectOptions}
        observations={[{ attribute: '', growth_form: '', id: '1', length: 10 }]}
        recordType={'lit'}
      />,
    )
    expect(screen.getByText('100.0')).toBeInTheDocument() // Missing category will be 100.0%
  })

  it('heads the cover rows Benthic cover and shows no Bleaching section unless bleaching is included', () => {
    render(
      <BenthicPitLitObservationSummaryStats
        benthicAttributeSelectOptions={benthicAttributeSelectOptions}
        coralAttributeIdsByType={{ hardCoral: new Set(['attr1']), softCoral: new Set(['attr2']) }}
        observations={[{ attribute: 'attr1', growth_form: '', id: '1', bleaching_status: 1 }]}
        recordType={'pit'}
      />,
    )

    expect(screen.getByText('observations.benthic_cover_heading')).toBeInTheDocument()
    expect(screen.queryByText('observations.bleaching_summary_heading')).not.toBeInTheDocument()
  })

  it('opens Hard coral to its bleached statuses on load, and opens Soft coral on request', async () => {
    const user = userEvent.setup()

    render(
      <BenthicPitLitObservationSummaryStats
        benthicAttributeSelectOptions={benthicAttributeSelectOptions}
        coralAttributeIdsByType={{ hardCoral: new Set(['attr1']), softCoral: new Set(['attr2']) }}
        includeBleaching={true}
        observations={[
          { attribute: 'attr1', growth_form: '', id: '1', bleaching_status: 1 },
          { attribute: 'attr2', growth_form: '', id: '2', bleaching_status: 0 },
        ]}
        recordType={'pit'}
      />,
    )

    expect(screen.getByText('observations.bleaching_summary_heading')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /observations.hard_coral/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('row', { name: '% bleaching_status.pale 100.0' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /observations.soft_coral/ }))

    expect(screen.getByRole('row', { name: '% bleaching_status.pale 0.0' })).toBeInTheDocument()
  })

  it('leaves out a coral type with no status recorded, and the whole section when neither has one', () => {
    const coralAttributeIdsByType = { hardCoral: new Set(['attr1']), softCoral: new Set(['attr2']) }
    const { rerender } = render(
      <BenthicPitLitObservationSummaryStats
        benthicAttributeSelectOptions={benthicAttributeSelectOptions}
        coralAttributeIdsByType={coralAttributeIdsByType}
        includeBleaching={true}
        observations={[
          { attribute: 'attr1', growth_form: '', id: '1', bleaching_status: 1 },
          { attribute: 'attr2', growth_form: '', id: '2', bleaching_status: null },
        ]}
        recordType={'pit'}
      />,
    )

    expect(screen.getByRole('button', { name: /observations.hard_coral/ })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /observations.soft_coral/ }),
    ).not.toBeInTheDocument()

    rerender(
      <BenthicPitLitObservationSummaryStats
        benthicAttributeSelectOptions={benthicAttributeSelectOptions}
        coralAttributeIdsByType={coralAttributeIdsByType}
        includeBleaching={true}
        observations={[{ attribute: 'attr1', growth_form: '', id: '1', bleaching_status: null }]}
        recordType={'pit'}
      />,
    )

    expect(screen.queryByText('observations.bleaching_summary_heading')).not.toBeInTheDocument()
  })

  it('keeps a coral type open after its rows go away and come back', async () => {
    const user = userEvent.setup()
    const renderWithSoftCoralStatus = (bleachingStatus: number | null) => (
      <BenthicPitLitObservationSummaryStats
        benthicAttributeSelectOptions={benthicAttributeSelectOptions}
        coralAttributeIdsByType={{ hardCoral: new Set(['attr1']), softCoral: new Set(['attr2']) }}
        includeBleaching={true}
        observations={[
          { attribute: 'attr1', growth_form: '', id: '1', bleaching_status: 0 },
          { attribute: 'attr2', growth_form: '', id: '2', bleaching_status: bleachingStatus },
        ]}
        recordType={'pit'}
      />
    )
    const { rerender } = render(renderWithSoftCoralStatus(0))

    await user.click(screen.getByRole('button', { name: /observations.soft_coral/ }))
    rerender(renderWithSoftCoralStatus(null))
    rerender(renderWithSoftCoralStatus(1))

    expect(screen.getByRole('button', { name: /observations.soft_coral/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })
})
