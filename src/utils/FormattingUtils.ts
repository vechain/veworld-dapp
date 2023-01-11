export const humanAddress = (
  address: string,
  lengthBefore = 4,
  lengthAfter = 10
) => {
  const before = address.substring(0, lengthBefore)
  const after = address.substring(address.length - lengthAfter)
  return `${before}…${after}`
}
