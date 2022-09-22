import { getObjectById } from '../../../../library/getObjectById'

export const fishBeltBins = {
  5: [
    { label: '0 - 5', value: 2.5 },
    { label: '5 - 10', value: 7.5 },
    { label: '10 - 15', value: 12.5 },
    { label: '15 - 20', value: 17.5 },
    { label: '20 - 25', value: 22.5 },
    { label: '25 - 30', value: 27.5 },
    { label: '30 - 35', value: 32.5 },
    { label: '35 - 40', value: 37.5 },
    { label: '40 - 45', value: 42.5 },
    { label: '45 - 50', value: 47.5 },
    { label: '50+', value: 50 },
  ],
  10: [
    { label: '0 - 10', value: 5 },
    { label: '10 - 20', value: 15 },
    { label: '20 - 30', value: 25 },
    { label: '30 - 40', value: 35 },
    { label: '40 - 50', value: 45 },
    { label: '50+', value: 50 },
  ],
  AGRRA: [
    { label: '0 - 5', value: 2.5 },
    { label: '6 - 10', value: 7.4 },
    { label: '11 - 20', value: 15 },
    { label: '21 - 30', value: 25 },
    { label: '31 - 40', value: 35 },
    { label: '41 - 50', value: 45 },
    { label: '50+', value: 50 },
  ],
}

export const getFishBinLabel = (choices, fishBinId) =>
  getObjectById(choices?.fishsizebins.data, fishBinId)?.name
