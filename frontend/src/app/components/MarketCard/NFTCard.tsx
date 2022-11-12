import React, { useCallback } from 'react'
import { styled } from '../../../styles'
import { Button, textVariant, Txt } from '../../UIkit'
import BasicCard, { BasicCardControls, BasicCardSquareImg } from './BasicCard'

export const CardControls = styled(BasicCardControls, {
  height: '144px',
  position: 'absolute',
  left: 0,
  right: 0,
  transform: 'translateY(0)',
  transition: 'all 0.25s ease-in-out',
  bottom: '-48px',
  transitionDelay: '0.35s'
})

export const CardTitle = styled('h5', {
  ...textVariant('primary2').true,
  marginBottom: '$1',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: '$gray500',
  transitionDelay: '0.35s'
})

const generateHoverStylesForCard = () => {
  const hoverStyles: any = {}
  hoverStyles[`&:hover ${CardControls.selector}`] = {
    transform: 'translateY(-48px)',
    transitionDelay: '0s'
  }

  hoverStyles[`&:hover ${CardTitle.selector}`] = {
    color: '$blue900',
    transitionDelay: '0s'
  }

  hoverStyles['&:hover'] = {
    background: '$gradients$main',
    transitionDelay: '0s'
  }

  return hoverStyles
}

export const CardCollection = styled('p', {
  ...textVariant('secondary3').true,
  marginBottom: '$1'
})

export const PriceInfo = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$3'
})

export const UserContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$1',
  color: '$gray500'
})

export const UserImg = styled('img', {
  width: '20px',
  height: '20px',
  borderRadius: '50%'
})

export const UserName = styled('p', {
  ...textVariant('primary3').true,
  lineHeight: '$body2'
})

export const Price = styled('span', {
  ...textVariant('primary1'),
  color: '$blue900',
  fontWeight: '600',
  lineHeight: '$body2'
})

export const ButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center'
})

export interface NFTCardProps {
  imageURL: string
  title: string
  collection: string
  user: {
    img: string
    username: string
  }
  price: number
}

export const Card = styled(BasicCard, {})

export const BorderLayout = styled('div', {
  background: 'transparent',
  width: '259px',
  height: '324px',
  borderRadius: 'calc($3 + 2px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ...generateHoverStylesForCard()
})

export default function NFTCard(props: NFTCardProps) {
  const formatPrice = useCallback((price: number) => {
    return `${price.toFixed(3)} ETH`
  }, [])

  return (
    <BorderLayout>
      <Card>
        <BasicCardSquareImg src={props.imageURL} />
        <CardControls>
          <CardTitle title={props.title}>{props.title}</CardTitle>
          <CardCollection>{props.collection}</CardCollection>
          <PriceInfo>
            <UserContainer>
              <UserImg src={props.user.img} />
              <UserName>{props.user.username}</UserName>
            </UserContainer>
            <Price>{formatPrice(props.price)}</Price>
          </PriceInfo>
          <ButtonContainer>
            <Button
              primary
              small={'true'}
              css={{ marginLeft: 'auto', marginRight: 'auto' }}
            >
              <Txt primary3>Buy now</Txt>
            </Button>
          </ButtonContainer>
        </CardControls>
      </Card>
    </BorderLayout>
  )
}
