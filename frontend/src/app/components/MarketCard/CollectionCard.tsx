import React, { ReactNode } from 'react'
import { styled } from '../../../styles'
import { textVariant } from '../../UIkit'
import BasicCard, { BasicCardControls, BasicCardSquareImg } from './BasicCard'

interface Props {
  imageUrl: string
  iconURL: string
  description: ReactNode
}

const CardControls = styled(BasicCardControls, {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  heigth: 96,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '28px 12px'
})

const Description = styled('p', {
  maxWidth: '231px',
  textAlign: 'center',
  ...textVariant('primary2').true,
  color: '$gray500',
  lineHeight: '143%'
})

const CardImg = styled(BasicCardSquareImg, {
  height: '265px',
  objectFit: 'cover'
})

const CardIcon = styled('img', {
  width: 49,
  height: 48,
  borderRadius: '$2',
  position: 'absolute',
  top: -24,
  objectPosition: 'center'
})

export default function CollectionCard(props: Props) {
  return (
    <BasicCard>
      <CardImg src={props.imageUrl} />
      <CardControls>
        <CardIcon src={props.iconURL} />
        <Description>{props.description}</Description>
      </CardControls>
    </BasicCard>
  )
}
