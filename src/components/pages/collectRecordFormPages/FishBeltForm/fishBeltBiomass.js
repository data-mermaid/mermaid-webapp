import { getObjectById } from '../../../../library/getObjectById'

/* this whole file is copy pasted (for the most part) from v1. */
const relationalOperatorFunctions = {
  '==': function (a, b) {
    return a === b
  },
  '!=': function (a, b) {
    return a !== b
  },
  '>': function (a, b) {
    return a > b
  },
  '>=': function (a, b) {
    return a >= b
  },
  '<': function (a, b) {
    return a < b
  },
  '<=': function (a, b) {
    return a <= b
  },
}

const utilsCombinations = (arr) => {
  let i, j, temp

  const result = []
  const arrLen = arr.length
  const power = Math.pow
  const combinations = power(2, arrLen)

  for (i = 0; i < combinations; i++) {
    temp = []

    for (j = 0; j < arrLen; j++) {
      if (i & power(2, j)) {
        temp.push(arr[j])
      }
    }
    if (temp.length > 0) {
      result.push(temp)
    }
  }

  return result
}

const evaluateConditions = (fishSize, conditionsCombo) => {
  const results = conditionsCombo.map((cond) => {
    const op = relationalOperatorFunctions[cond.operator]

    if (op == null) {
      return false
    }

    return op(fishSize, cond.size)
  })

  return results.every((val) => val === true)
}

const calcObsBiomass = ({ size, count, constant_a, constant_b, constant_c, length, width }) => {
  let ret = null

  if (
    Number.isFinite(size) &&
    Number.isFinite(count) &&
    Number.isFinite(constant_a) &&
    Number.isFinite(constant_b) &&
    Number.isFinite(constant_c) &&
    Number.isFinite(length) &&
    Number.isFinite(width)
  ) {
    const biomass = (count * (constant_a * Math.pow(size * constant_c, constant_b))) / 1000
    const area = (length * width) / 10000

    // m2 to hectares
    ret = biomass / area // result is in kg/ha
  }

  return ret
}

const getBeltFishWidthVal = (fishSize, beltfishWidthConditions) => {
  if (
    fishSize == null ||
    fishSize < 0 ||
    beltfishWidthConditions == null ||
    beltfishWidthConditions.length === 0
  ) {
    return null
  }

  if (beltfishWidthConditions.length === 1) {
    return beltfishWidthConditions[0].val
  }

  let defaultCondition = null

  const conditions = []

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let n = 0; n < beltfishWidthConditions.length; n++) {
    const cnd = beltfishWidthConditions[n]

    if (cnd.operator == null || cnd.size == null) {
      defaultCondition = cnd
    } else {
      conditions.push(cnd)
    }
  }

  const combos = utilsCombinations(beltfishWidthConditions)

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < combos.length; i++) {
    const combo = combos[i]

    if (evaluateConditions(fishSize, combo)) {
      return combo[0].val
    }
  }

  return (defaultCondition && defaultCondition.val) || null
}

// this function is new to v2. Its acting as a gateway to the older functions.
export const getObservationBiomass = ({
  choices,
  fishNameConstants,
  observation,
  transectLengthSurveyed,
  widthId,
}) => {
  const { size, count, fish_attribute } = observation
  const fishConstants = getObjectById(fishNameConstants, fish_attribute)

  const fishWidthConditions = getObjectById(choices.belttransectwidths.data, widthId)?.conditions

  return calcObsBiomass({
    size,
    count,
    constant_a: fishConstants?.biomass_constant_a,
    constant_b: fishConstants?.biomass_constant_b,
    constant_c: fishConstants?.biomass_constant_c,
    length: transectLengthSurveyed,
    width: getBeltFishWidthVal(size, fishWidthConditions),
  })
}
