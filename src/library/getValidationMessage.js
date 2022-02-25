const generateRequiredMessage = (label) => {
  return label.length ? `${label} is required` : 'required'
}

export const getValidationMessage = (validation, label = '') => {
  const { code, context, name } = validation

  switch (code) {
    case 'required':
      return generateRequiredMessage(label)
    case 'site_not_found':
      return 'Site record not available for similarity validation'
    case 'not_unique_site':
      return 'Site: Similar records detected'
    case 'management_not_found':
      return 'Management Regime record not available for similarity validation'
    case 'not_unique_management':
      return 'Management Regime: Similar records detected'
    case 'minimum_total_fish_count':
      return `Total fish count less than ${context?.minimum_fish_count}`
    case 'too_few_observations':
      return `Fewer than ${context?.observation_count_range[0]} observations`
    case 'too_many_observations':
      return `Greater than ${context?.observation_count_range[1]} observations`
    case 'low_density':
      return `Fish biomass less than ${context?.biomass_range[1]} kg/ha`
    case 'high_density':
      return `Fish biomass greater than ${context?.biomass_range[0]} kg/ha`
    case 'len_surveyed_out_of_range':
      return `Transect length surveyed value outside range of ${context?.len_surveyed_range[0]} and ${context?.len_surveyed_range[1]}"`
    case 'max_depth':
    case 'invalid_depth':
      return `Depth value outside range of ${context?.depth_range[0]} and ${context?.depth_range[1]}`
    case 'invalid_fish_count':
      return `Invalid fish count`
    case 'future_sample_date':
      return 'Sample date is in the future'
    case 'sample_time_out_of_range':
      return `Sample time outside of range ${context?.time_range[0]} and ${context?.time_range[1]}`
    case 'no_region_match':
      return 'Attributes outside of site region'
    case 'not_part_of_fish_family_subset':
      return 'There are fish that are not part of project defined fish families'
    case 'all_equal':
      return 'All observations are the same'
    case 'duplicate_transect':
      return 'Transect already exists'
    default:
      return code || name
  }
}
