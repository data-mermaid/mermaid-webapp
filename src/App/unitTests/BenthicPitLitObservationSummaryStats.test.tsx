import React from 'react'
import { render, screen } from '@testing-library/react'
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
})
