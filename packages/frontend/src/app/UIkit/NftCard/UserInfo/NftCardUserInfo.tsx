import React from 'react'

import { Flex } from '../../Flex'
import { StyledUserAddress, StyledUserImg } from './NftCardUserInfo.styles'

interface NftCardUserInfoProps {
  img: string
  address: string
}

export const NftCardUserInfo: React.FC<NftCardUserInfoProps> = ({ img, address }) => {
  return (
    <Flex gap="$1">
      <StyledUserImg src={img} />
      <StyledUserAddress primary3>{address}</StyledUserAddress>
    </Flex>
  )
}
