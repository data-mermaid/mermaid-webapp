import language from '../../language'

export const getSampleUnitLabel = (sampleUnit) => {
  return sampleUnit.length
    ? sampleUnit.map(({ id, site_name, protocol, depth, label, sample_date }) => {
        const protocolName = language.protocolTitles[protocol]
        const sampleUnitLabel = label
          ? [protocolName, site_name, depth, label]
          : [protocolName, site_name, depth]

        return {
          id,
          protocol,
          sampleUnitLabel: `${sampleUnitLabel.join(' - ')} (${sample_date})`,
        }
      })
    : []
}
