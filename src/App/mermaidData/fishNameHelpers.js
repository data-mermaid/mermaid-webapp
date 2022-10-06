const FAMILY_RANK = 'family'
const GENUS_RANK = 'genus'
const SPECIES_RANK = 'species'
const GROUPING = 'grouping'

export const fishReferenceEndpoint = {
  family: 'families',
  genus: 'genera',
  species: 'species',
  grouping: 'groupings',
}

export const getFishNameConstants = ({ species, genera, families }) => {
  const fishNameMergedObject = [...species, ...genera, ...families]

  return fishNameMergedObject.map((fishNameObject) => {
    const { id, biomass_constant_a, biomass_constant_b, biomass_constant_c } = fishNameObject

    let taxonomic_rank = FAMILY_RANK

    if ('genus' in fishNameObject) {
      taxonomic_rank = SPECIES_RANK
    } else if ('family' in fishNameObject) {
      taxonomic_rank = GENUS_RANK
    } else if ('fish_attributes' in fishNameObject) {
      taxonomic_rank = GROUPING
    }

    return {
      id,
      biomass_constant_a,
      biomass_constant_b,
      biomass_constant_c,
      taxonomic_rank,
    }
  })
}

export const getFishNameOptions = ({ species, genera, families }) => {
  const speciesOptions = species.map(({ id, display_name }) => ({
    label: display_name,
    value: id,
  }))

  const generaAndFamiliesOptions = [...genera, ...families].map(({ id, name }) => ({
    label: name,
    value: id,
  }))

  return [...speciesOptions, ...generaAndFamiliesOptions]
}
