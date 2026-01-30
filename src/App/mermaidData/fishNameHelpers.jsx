import React from 'react'
import styled from 'styled-components'
import language from '../../language'
import { Table, Td, Tr } from '../../components/generic/Table/table'
import theme from '../../theme'
import { TextLink, LinkContainer } from '../../components/generic/links'
import { useTranslation } from 'react-i18next'

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

export const getFishNameConstants = ({ species, genera, families, groupings = [] }) => {
  const fishNameMergedObject = [...species, ...genera, ...families, ...groupings]

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

export const getFishNameOptions = ({ species, genera, families, groupings = [] }) => {
  const speciesOptions = species.map(({ id, display_name }) => ({
    label: display_name,
    value: id,
  }))

  const generaAndFamiliesOptions = [...genera, ...families, ...groupings].map(({ id, name }) => ({
    label: name,
    value: id,
  }))

  return [...speciesOptions, ...generaAndFamiliesOptions]
}

export const getFishNameTable = ({
  fishFamilies,
  fishGroupings,
  choices,
  fishGenera,
  fishSpecies,
  fishNameId,
}) => {
  const { t } = useTranslation
  const fishNameInfo = [...fishSpecies, ...fishGenera, ...fishFamilies, ...fishGroupings].find(
    (item) => item.id === fishNameId,
  )

  const tableLanguage = {
    family: t('observations.family'),
    biomassConstants: t('observations.biomass_constants'),
    maxLength: `${t('observations.max_length')} (${t('measurements.centimeter_short')})`,
    groupSize: t('observations.group_size'),
    maxType: t('observations.max_type'),
    functionalGroup: t('observations.functional_group'),
    trophicGroup: t('observations.trophic_group'),
    seeReferencesLink: t('observations.see_references_link'),
  }

  const TableContainer = styled('div')`
    outline: ${theme.color.outline};

    & label {
      padding: ${theme.spacing.medium};
      display: flex;
      justify-content: center;
      font-weight: bold;
    }

    && th {
      position: unset;
    }
    && td {
      padding: ${theme.spacing.medium};
    }

    & tr {
      border-width: ${theme.spacing.borderSmall};
      border-color: ${theme.color.tableBorderColor};
      border-style: solid;
    }

    & ul {
      padding: 0;
      margin: 0;
      list-style-type: none;
    }
  `
  const trophicGroupName = choices.fishgrouptrophics.data?.find(
    (item) => item.id === fishNameInfo?.trophic_group,
  )?.name

  const functionalGroupName = choices.fishgroupfunctions.data?.find(
    (item) => item.id === fishNameInfo?.functional_group,
  )?.name

  const fishGroupSizeName = choices.fishgroupsizes.data?.find(
    (item) => item.id === fishNameInfo?.group_size,
  )?.name

  const maxLength = fishNameInfo?.max_length_type
    ? `${fishNameInfo?.max_length} (${fishNameInfo?.max_length_type})`
    : fishNameInfo?.max_length

  const fishFamilyId =
    fishNameInfo?.family ??
    fishGenera.find((genusInfo) => genusInfo.id === fishNameInfo?.genus)?.family
  const fishFamilyName = fishFamilies.find((item) => item.id === fishFamilyId)?.name

  const FishRefLinkContent = () => (
    <LinkContainer>
      <TextLink
        href={import.meta.env.VITE_MERMAID_REFERENCE_LINK}
        target="_blank"
        rel="noreferrer"
        download
      >
        {tableLanguage.seeReferencesLink}
      </TextLink>
    </LinkContainer>
  )

  return (
    <TableContainer>
      {fishNameInfo.name === 'Others CRCP' ? (
        <FishRefLinkContent />
      ) : (
        <>
          <label htmlFor="popoverTable">{fishNameInfo?.display_name ?? fishNameInfo?.name}</label>
          <Table id="popoverTable">
            <tbody>
              {fishFamilyName ? (
                <Tr>
                  <Td as="th">{tableLanguage.family}</Td>
                  <Td>{fishFamilyName}</Td>
                </Tr>
              ) : null}
              <Tr>
                <Td as="th">{tableLanguage.biomassConstants}</Td>
                <Td>
                  <ul>
                    <li>A - {fishNameInfo?.biomass_constant_a}</li>
                    <li>B - {fishNameInfo?.biomass_constant_b}</li>
                    <li>C - {fishNameInfo?.biomass_constant_c}</li>
                  </ul>
                </Td>
              </Tr>

              {fishNameInfo?.max_length ? (
                <Tr>
                  <Td as="th">{tableLanguage.maxLength}</Td>
                  <Td>{maxLength}</Td>
                </Tr>
              ) : null}
              {fishGroupSizeName ? (
                <Tr>
                  <Td as="th">{tableLanguage.groupSize}</Td>
                  <Td>{fishGroupSizeName}</Td>
                </Tr>
              ) : null}
              {fishNameInfo?.max_type ? (
                <Tr>
                  <Td as="th">{tableLanguage.maxType}</Td>
                  <Td>{fishNameInfo?.max_length_type}</Td>
                </Tr>
              ) : null}
              {functionalGroupName ? (
                <Tr>
                  <Td as="th">{tableLanguage.functionalGroup}</Td>
                  <Td>{functionalGroupName}</Td>
                </Tr>
              ) : null}
              {trophicGroupName ? (
                <Tr>
                  <Td as="th">{tableLanguage.trophicGroup}</Td>
                  <Td>{trophicGroupName}</Td>
                </Tr>
              ) : null}
            </tbody>
          </Table>
        </>
      )}
    </TableContainer>
  )
}
