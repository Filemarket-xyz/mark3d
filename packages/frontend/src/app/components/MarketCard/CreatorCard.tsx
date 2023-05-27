import React, { ReactNode } from 'react'

import { styled } from '../../../styles'
import { textVariant } from '../../UIkit'
import BasicCard, { BasicCardControls, BasicCardSquareImg } from './BasicCard'
import { BorderLayout } from './NFTCard'

export interface CreatorCardProps {
  bgImageUrl: string
  user: {
    imageUrl: string
    name: string
    social: string
  }
  description: ReactNode
}

const BgImage = styled(BasicCardSquareImg, {
  height: '100%',
})

const Controls = styled(BasicCardControls, {
  height: 212,
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
})

const UserImg = styled('img', {
  width: 95,
  height: 95,
  position: 'absolute',
  top: -48,
  borderRadius: '50%',
  objectFit: 'contain',
})

const UserContainer = styled('div', {
  paddingTop: '$4',
  marginBottom: '$3',
})

const UserName = styled('p', {
  ...textVariant('primary1'),
  fontWeight: 600,
  lineHeight: '125%',
  background: '$gradients$main',
  backgroundClip: 'text',
  color: 'transparent',
  marginBottom: '$1',
  textAlign: 'center',
})

const UserSocial = styled('p', {
  ...textVariant('primary3'),
  fontSize: '$primary3',
  fontWeight: 600,
  textAlign: 'center',
})

const Description = styled('p', {
  ...textVariant('secondary3'),
  fontSize: '$secondary3',
  color: '$gray500',
  maxWidth: 215,
})

export default function CreatorCard(props: CreatorCardProps) {
  return (
    <BorderLayout>
      <BasicCard>
        <BgImage src={props.bgImageUrl} />
        <Controls>
          <UserImg src={props.user.imageUrl} />
          <UserContainer>
            <UserName>
              =
              {props.user.name}
            </UserName>
            <UserSocial>{props.user.social}</UserSocial>
          </UserContainer>
          <Description>{props.description}</Description>
        </Controls>
      </BasicCard>
    </BorderLayout>
  )
}
