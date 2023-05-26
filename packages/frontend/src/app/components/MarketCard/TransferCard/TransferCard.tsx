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
      <NftCardInfoRow>
        <NftCardUserInfo img={user.img} address={user.address} />
        {price && <StyledTxtValue primary2>{price}</StyledTxtValue>}
      </NftCardInfoRow>
      <NftCardInfoRow>
        <StyledTxtName primary3>Status</StyledTxtName>
        <StyledTxtValue primary1>{status}</StyledTxtValue>
      </NftCardInfoRow>
    </NftCardBase>
  )
}
