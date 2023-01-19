import BigNumber from "bignumber.js"

export const humanAddress = (
  address: string,
  lengthBefore = 4,
  lengthAfter = 10
) => {
  const before = address.substring(0, lengthBefore)
  const after = address.substring(address.length - lengthAfter)
  return `${before}…${after}`
}

/**
 * Scale the number up by the specified number of decimal places
 * @param val - the value to scale up (a number or string representation of a number)
 * @param scaleDecimal - the number of decimals to scale up by
 * @param roundDecimal - the number of decimals to round the result to
 * @param roundingStrategy - what strategy to use when rounding. Based on the strategies defined in `bignumber.js`. Default strategy is ROUND_HALF_UP
 * @returns the scaled up result as a string
 */
export const scaleNumberUp = (
  val: BigNumber.Value,
  scaleDecimal: number,
  roundDecimal = 0,
  roundingStrategy = BigNumber.ROUND_HALF_UP
): string => {
  try {
    if (scaleDecimal === 0) return new BigNumber(val).toFixed()
    if (scaleDecimal < 0)
      throw Error("Decimal value must be greater than or equal to 0")
    const valBn = new BigNumber(val)
    if (valBn.isNaN()) throw Error("The value provided is NaN.")

    const amount = valBn.times(`1${"0".repeat(scaleDecimal)}`)

    if (scaleDecimal === roundDecimal) return amount.toFixed()

    return amount.toFixed(roundDecimal, roundingStrategy)
  } catch (e) {
    console.error(e)
    throw new Error(`Failed to scale number up (${val})`)
  }
}

/**
 * Scale the number down by the specified number of decimal places
 * @param val - the value to scale down (a number or string representation of a number)
 * @param scaleDecimal - the number of decimals to scale down by
 * @param roundDecimal - the number of decimals to round the result to
 * @param roundingStrategy - what strategy to use when rounding. Based on the strategies defined in `bignumber.js`. Default strategy is ROUND_HALF_UP
 * @returns the scaled up result as a string
 */
export const scaleNumberDown = (
  val: BigNumber.Value,
  scaleDecimal: number,
  roundDecimal = 0,
  roundingStrategy = BigNumber.ROUND_HALF_UP
): string => {
  try {
    if (scaleDecimal === 0) return new BigNumber(val).toFixed()
    if (scaleDecimal < 0)
      throw Error("Decimal value must be greater than or equal to 0")

    const valBn = new BigNumber(val)
    if (valBn.isNaN()) throw Error("The value provided is NaN.")

    const amount = valBn.dividedBy(`1${"0".repeat(scaleDecimal)}`)

    if (scaleDecimal === roundDecimal) return amount.toFixed()

    return amount.toFixed(roundDecimal, roundingStrategy)
  } catch (e) {
    console.error(e)
    throw new Error(`Failed to scale number down (${val})`)
  }
}
