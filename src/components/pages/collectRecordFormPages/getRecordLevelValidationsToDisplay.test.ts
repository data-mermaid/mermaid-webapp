import { expect, test } from 'vitest'
import getRecordLevelValidationsToDisplay from './getRecordLevelValidationsToDisplay'

const drySubmit = { code: 'unsuccessful_dry_submit', status: 'error' }
const lenSurveyedNotPositive = { code: 'len_surveyed_not_positive', status: 'error' }
const intervalSizeNotPositive = { code: 'interval_size_not_positive', status: 'error' }
const allEqual = { code: 'all_equal', status: 'warning' }
const tooFew = { code: 'too_few_observations', status: 'error' }

test('hides the dry submit summary while another record-level error is showing', () => {
  expect(getRecordLevelValidationsToDisplay([drySubmit, tooFew])).toEqual([tooFew])
})

test('shows the dry submit summary when it is the only error', () => {
  expect(getRecordLevelValidationsToDisplay([drySubmit, allEqual])).toEqual([drySubmit, allEqual])
})

test('hides the record-level transect length error, which the field already reports', () => {
  expect(getRecordLevelValidationsToDisplay([lenSurveyedNotPositive, allEqual])).toEqual([allEqual])
})

test('hides the record-level interval size error, which the field already reports', () => {
  expect(getRecordLevelValidationsToDisplay([intervalSizeNotPositive, allEqual])).toEqual([
    allEqual,
  ])
})

test('a hidden transect length error does not hide the dry submit summary', () => {
  expect(getRecordLevelValidationsToDisplay([lenSurveyedNotPositive, drySubmit])).toEqual([
    drySubmit,
  ])
})
