export const formatNumber = (number?: string | number, toFixed?: number): string => {
  if (!number) return ''

  let value = number
  if (toFixed) {
    value = Number(value).toFixed(toFixed)
  }
  const parts = value.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  return parts.join('.')
}
