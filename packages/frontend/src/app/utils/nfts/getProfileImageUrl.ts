import { toSvg } from 'jdenticon'

export const getProfileImageUrl = (profileAddress: string, size = 20) => {
  const image = toSvg(profileAddress, size)
  return `data:image/svg+xml;utf8,${encodeURIComponent(image)}`
}
