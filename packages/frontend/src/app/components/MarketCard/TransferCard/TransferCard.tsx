import React from 'react'

import { NftCardBase, NftCardInfoRow, NftCardUserInfo } from '../../../UIkit'
import { StyledTxtName, StyledTxtValue } from './TransferCard.styles'

export interface TransferCardProps {
  imageURL: string
  title: string
  collectionName: string
  user: {
    img: string
    address: string
  }
  button: {
    link: string
    text: string
  }
  price?: string
  status: string
}

export const TransferCard: React.FC<TransferCardProps> = ({
  imageURL,
  title,
  collectionName,
  user,
  price,
  status,
  button,
}) => {
  return (
    <NftCardBase
      to={button.link}
      imgSrc={imageURL}
      title={title}
      collectionName={collectionName}
      button={{ to: button.link, text: button.text }}
    >
      <NftCardUserInfo img={user.img} address={user.address} />
      <NftCardInfoRow>
        <StyledTxtName primary2>{status}</StyledTxtName>
        {price && <StyledTxtValue primary2>{price}</StyledTxtValue>}
      </NftCardInfoRow>
    </NftCardBase>
  )
}