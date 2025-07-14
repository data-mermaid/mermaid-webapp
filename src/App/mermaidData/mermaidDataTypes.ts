import PropTypes from 'prop-types'

interface SampleEvent {
  site?: string
  management?: string
  sample_date: string
}

export interface Observer {
  id?: string
  updated_by?: string
  profile_name?: string
  created_on?: string
  updated_on?: string
  role?: number
  created_by?: string
  project?: string
  profile?: string
}

interface FishBeltTransect {
  depth?: number | string
  label?: string
  len_surveyed?: number | string
  number?: number | string
  reef_slope?: string
  sample_time?: string
  size_bin?: string
  width?: string
  visibility?: string
  current?: string
  relative_depth?: string
  tide?: string
  notes?: string
}

interface BenthicTransect {
  reef_slope?: string
  visibility?: string
  current?: string
  relative_depth?: number | string
  tide?: string
  notes?: string
}

interface BenthicPhotoQuadratTransect {
  tide?: string
  depth?: number | string
  label?: string
  number?: number | string
  current?: string
  reef_slope?: string
  visibility?: string
  sample_time?: string
  len_surveyed?: number | string
  num_quadrats?: number | string
  quadrat_size?: number | string
  quadrat_number_start?: number | string
  relative_depth?: string
  num_points_per_quadrat?: number
  notes?: string
}

interface BleachingQuadrat {
  id?: string
  depth?: number | string
  label?: string
  visibility?: string
  current?: string
  quadrat_size?: number | string
  relative_depth?: string
  tide?: string
  notes?: string
}

interface BenthicPhotoQuadratObservation {
  id?: string
  attribute?: string
  num_points?: number | string
  growth_form?: string
  quadrat_number?: number | string
}

interface SubmittedFishBeltObservation {
  id?: string
  updated_by?: string
  size?: number | string
  created_on?: string
  updated_on?: string
  count?: number
  include?: boolean
  notes?: string
  created_by?: string
  beltfish?: string
  fish_attribute?: string
}

interface SubmittedBenthicPhotoQuadratObservation {
  attribute?: string
  benthic_photo_quadrat_transect?: string
  count?: number
  created_by?: string
  created_on?: string
  growth_form?: string
  id?: string
  notes?: string
  num_points?: number
  quadrat_number?: number
  updated_by?: string
  updated_on?: string
}

export const projectPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  countries: PropTypes.arrayOf(PropTypes.string),
  num_sites: PropTypes.number,
  updated_on: PropTypes.string,
  data_policy_beltfish: PropTypes.number,
  data_policy_benthiclit: PropTypes.number,
  data_policy_bleachingqc: PropTypes.number,
  includes_gfcr: PropTypes.bool,
})

export interface Project {
  id: string | number
  name: string
  countries: string[]
  num_sites: number
  updated_on: string
  data_policy_beltfish: number
  data_policy_benthiclit: number
  data_policy_bleachingqc: number
  includes_gfcr: boolean
}

export type Projects = Project[]

export interface Site {
  id: string
  name: string
  reef_type: string
  reef_zone: string
  exposure: string
}

export const copySitePropType = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  project: PropTypes.string,
  projectName: PropTypes.string,
  countryName: PropTypes.string,
  reefType: PropTypes.string,
  reefZone: PropTypes.string,
  exposure: PropTypes.string,
  location: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }),
})

export const fishNameConstantsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string,
    biomass_constant_a: PropTypes.number,
    biomass_constant_b: PropTypes.number,
    biomass_constant_c: PropTypes.number,
  }),
)

export interface FishBeltRecord {
  id: string
  data: {
    protocol: string
    sample_event: SampleEvent
    fishbelt_transect: FishBeltTransect
    observers: Observer[]
  }
}

export interface BenthicPhotoQuadratRecord {
  id: string
  data: {
    protocol: string
    sample_event: SampleEvent
    quadrat_transect: BenthicPhotoQuadratTransect
    obervers: Observer[]
    obs_benthic_photo_quadrats: BenthicPhotoQuadratObservation[]
  }
}

export interface SubmittedFishBelt {
  id: string
  sample_event: SampleEvent
  fishbelt_transect: FishBeltTransect
  observers: Observer[]
  obs_belt_fishes: SubmittedFishBeltObservation[]
}

export interface SubmittedBenthicPhotoQuadrat {
  id: string
  collect_record_id: string
  sample_event: SampleEvent
  quadrat_transect: BenthicPhotoQuadratTransect
  observers: Observer[]
  obs_benthic_photo_quadrats: SubmittedBenthicPhotoQuadratObservation[]
}

export interface BenthicPitRecord {
  id: string
  data: {
    interval_size: string | number
    interval_start: string | number
    benthic_transect: BenthicTransect
    obs_benthic_pits: {
      attribute: string
      growth_form: string
      id: string
      interval: string | number
    }[]
  }
}

export interface HabitatComplexityRecord {
  id: string
  data: {
    interval_size: string | number
    benthic_transect: BenthicTransect
    obs_habitat_complexities: {
      score: string
      id: string
      interval: string | number
    }[]
  }
}

export interface BenthicLitRecord {
  id: string
  data: {
    interval_size: string | number
    interval_start: string | number
    benthic_transect: BenthicTransect
  }
}

export interface ObservationsColoniesBleached {
  id: string
  attribute: string
  count_100: string | number
  count_20: string | number
  count_50: string | number
  count_80: string | number
  count_dead: string | number
  count_normal: string | number
  count_pale: string | number
  growth_form: string
}

export interface ObservationsQuadratBenthicPercent {
  id: string
  percent_algae: string | number
  percent_hard: string | number
  percent_soft: string | number
  quadrat_number: number
}

export interface ObservationsPercentCover {
  id: string
  percent_algae: string | number
  percent_hard: string | number
  percent_soft: string | number
  quadrat_number: number
}

export interface BleachingRecord {
  id: string
  data: {
    quadrat_collection: BleachingQuadrat
    obs_quadrat_benthic_percent: ObservationsQuadratBenthicPercent
    obs_colonies_bleached: ObservationsColoniesBleached
  }
}

export interface submittedHabitatComplexity {
  id: string
  interval_size: number
  benthic_transect: BenthicTransect
}

export interface ManagementRegime {
  id: string
  name: string
  name_secondary: string
  est_year: number | string
  size: number | string
  parties: string[]
  compliance: string
  open_access: boolean
  no_take: boolean
  access_restriction: boolean
  periodic_closure: boolean
  size_limits: boolean
  gear_restriction: boolean
  species_restriction: boolean
  notes: string
}

export interface CurrentUser {
  id: string
  first_name: string
  last_name: string
  full_name: string
  email: string
}

interface FishSizeBin {
  name: string
  data: {
    id: string
    name: string
    updated_on: string
    val: string
  }[]
}

interface BeltTransectWidth {
  name: string
  data: {
    id: string
    name: string
    updated_on: string
    conditions: {
      id: string
      name: string
      updated_on: string
      size: number
      operator: string
      val: number
    }[]
  }[]
}

interface ReefSlope {
  name: string
  data: {
    id: string
    name: string
    updated_on: string
    val: number
  }[]
}

export interface Choices {
  fishsizebins: FishSizeBin
  belttransectwidths: BeltTransectWidth
  reefslopes: ReefSlope
}

export type Observers = Observer[]

export interface Notification {
  count: number
  next: string
  previous: string
  results: {
    created_by: string
    created_on: string
    description: string
    id: string
    owner: string
    status: string
    title: string
    updated_by: string
    updated_on: string
  }[]
}

interface ValidationObjectBase {
  code: string
  context: string | object
  fields: string[]
  name: string
  status: string
  validation_id: string[] | number[]
}

type DepthValidationContext = string | { depth_range: number[] }
type LenSurveyedValidationContext = string | { len_surveyed_range: number[] }
type SampleTimeValidationContext = string | { time_range: string[] }
type Validations = ValidationObjectBase[]

interface DepthValidation extends ValidationObjectBase {
  context: DepthValidationContext
}

interface LenSurveyedValidation extends ValidationObjectBase {
  context: LenSurveyedValidationContext
}

interface SampleTimeValidation extends ValidationObjectBase {
  context: SampleTimeValidationContext
}

export type ObservationsValidation = Validations

export interface FishBeltValidation {
  depth: DepthValidation
  len_surveyed: LenSurveyedValidation
  number: Validations
  sample_time: SampleTimeValidation
  size_bin: Validations
  width: Validations
}

export interface BenthicPhotoQuadratValidation {
  depth: DepthValidation
  len_surveyed: LenSurveyedValidation
  num_points_per_quadrat: Validations
  num_quadrats: Validations
  quadrat_size: Validations
  number: Validations
  sample_time: SampleTimeValidation
}

export interface BenthicPitValidation {
  benthic_transect: {
    depth: DepthValidation
    len_surveyed: LenSurveyedValidation
    number: Validations
    sample_time: SampleTimeValidation
  }
  interval_start: Validations
  interval_size: Validations
  obs_benthic_pits: Validations
}

export interface HabitatComplexityValidation {
  benthic_transect: {
    depth: DepthValidation
    len_surveyed: LenSurveyedValidation
    number: Validations
    sample_time: SampleTimeValidation
  }
  interval_size: Validations
  obs_habitat_complexities: Validations
}

export interface SubNavNode {
  name: string
  number: number | string
  label: string
}

export type MermaidRecord =
  | BenthicLitRecord
  | BenthicPhotoQuadratRecord
  | BenthicPitRecord
  | BleachingRecord
  | FishBeltRecord
  | HabitatComplexityRecord

export interface FishFamily {
  id: string
  biomass_constant_a: number
  biomass_constant_b: number
  biomass_constant_c: number
  name: string
}

export interface FishGeneraSingular {
  id: string
  biomass_constant_a: number
  biomass_constant_b: number
  biomass_constant_c: number
  name: string
  family: string
}

export interface FishSpeciesSingular {
  id: string
  biomass_constant_a: number
  biomass_constant_b: number
  biomass_constant_c: number
  name: string
  display_name: string
  functional_group: string
  trophic_group: string
  max_length: number
  max_length_type: string
  group_size: string
}

export type FishFamilies = FishFamily[]
export type FishGenera = FishGeneraSingular[]
export type FishGroupings = FishFamily[]
export type FishSpecies = FishSpeciesSingular[]

export interface ImageClassificationPoint {
  id: string
  row: number
  column: number
  annotations: ImageClassificationPointAnnotation[]
}

export interface ImageClassificationPointAnnotation {
  ba_gr: string
  benthic_attribute: string
  ba_gr_label: string
  id: string
  is_confirmed: boolean
  is_machine_created?: boolean
  score?: number
  benthicAttributeId?: string
  growth_form?: string
  growthFormId?: string
  unconfirmedCount?: number
}

export interface ImageClassificationResponse {
  image: string
  original_image_width: number
  original_image_height: number
  patch_size: number
  points: ImageClassificationPoint[]
}

export interface InputOption {
  label: string
  value: string | number
}
