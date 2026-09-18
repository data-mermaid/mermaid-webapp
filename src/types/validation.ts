import type { ValidationStatus } from './constants'

// The `context` an API validator attaches to its result. Every key is optional because each
// validator sets only its own; the message text for a code reads the keys that code sets.
export interface ValidationContext {
  observation_id?: string
  id?: string
  biomass_range?: [number, number]
  category?: string
  decimal_places?: number
  depth_range?: [number, number]
  dry_submit_results?: Record<string, string>
  duplicate_transect_method?: string
  duplicates?: { id: string; index: number }[][]
  expected_count?: number
  interval_size_range?: [number, number]
  interval_start_range?: [number, number]
  invalid_paths?: string[]
  invalid_quadrat_numbers?: number[]
  len_surveyed?: number
  len_surveyed_range?: [number, number]
  minimum_fish_count?: number
  missing_intervals?: number[]
  missing_quadrat_numbers?: number[]
  observation_count_range?: [number, number]
  quadrat_size_range?: [number, number]
  time_range?: [string, string]
  total_obs_length?: number
  value_range?: [number, number]
}

// One entry in a collect record's `validations.results`, as the API sends it.
export interface Validation {
  status: ValidationStatus
  code?: string
  name?: string
  validation_id?: string
  fields?: string[]
  context?: ValidationContext | null
}
