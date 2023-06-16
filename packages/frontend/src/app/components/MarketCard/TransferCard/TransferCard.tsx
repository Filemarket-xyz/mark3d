import React from 'react'

import { HiddenFileMetaData } from '../../../../swagger/Api'
import { NftCardBase, NftCardUserInfo, PriceBadge } from '../../../UIkit'
import { FileType } from '../FileType'
import { StyledTxtName, StyledTxtValue } from './TransferCard.styles'

export interface TransferCardProps {
  imageURL: string
  title: string
  collectionName: string
  hiddenFileMeta?: HiddenFileMetaData
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
  hiddenFileMeta,
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
      fileType={<FileType hiddenFileMeta={hiddenFileMeta} />}
      button={{ to: button.link, text: button.text }}
    >
      <NftCardUserInfo img={user.img} address={user.address} />
      <PriceBadge
        left={<StyledTxtName primary2>{status}</StyledTxtName>}
        right={price && <StyledTxtValue primary2>{price}</StyledTxtValue>}
      />
    </NftCardBase>
  )
}
