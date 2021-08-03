export const getFishNameConstants = ({ species, genera, families }) => {
  const fishNameMungedObject = [...species, ...genera, ...families]

  return fishNameMungedObject.map(
    ({ id, biomass_constant_a, biomass_constant_b, biomass_constant_c }) => ({
      id,
      biomass_constant_a,
      biomass_constant_b,
      biomass_constant_c,
    }),
  )
}
