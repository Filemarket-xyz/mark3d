import { FC } from 'react'
import { toSvg } from 'jdenticon'

export interface AddressIconProps {
  size?: number
  address: string
}

export const AddressIcon: FC<AddressIconProps> = ({ size = 20, address }) => {
  const image = toSvg(address, size)
  return (
      <img
        alt="Identicon"
        src={`data:image/svg+xml;utf8,${encodeURIComponent(image)}`}
      />
  )
}
