export const getFishNameOptions = ({ species, genera, families }) => {
  const speciesOptions = species.map(({ id, display_name }) => ({
    label: display_name,
    value: id,
  }))

  const generaAndFamiliesOptions = [...genera, ...families].map(
    ({ id, name }) => ({
      label: name,
      value: id,
    }),
  )

  return [...speciesOptions, ...generaAndFamiliesOptions]
}
