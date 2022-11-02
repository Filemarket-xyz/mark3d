import React from 'react'
import { styled } from '../../../styles'
import { Button, textVariant, Txt } from '../../UIkit'
import cardImg from './img/cardImg.jpg'
import userimg from './img/userImg.jpg'

const CardControls = styled('div', {
  width: '100%',
  borderRadius: 'inherit',
  borderBottomLeftRadius: '0',
  borderBottomRightRadius: '0',
  backgroundColor: '$white',
  height: '144px',
  position: 'absolute',
  left: 0,
  right: 0,
  transform: 'translateY(0)',
  transition: 'all 0.25s ease-in-out',
  bottom: '-48px',
  padding: '$3 11px',
  transitionDelay: '0.35s'
})

const styles: any = {
  maxWidth: '255px',
  height: '320px',
  borderRadius: '$3',
  position: 'relative',
  overflow: 'hidden'
}
styles[`&:hover ${CardControls.selector}`] = {
  transform: 'translateY(-48px)',
  transitionDelay: '0s'
}

const Card = styled('div', styles)

const CardImg = styled('img', {
  width: '100%',
  height: '255px',
  borderRadius: 'inherit',
  borderBottomLeftRadius: '0',
  borderBottomRightRadius: '0',
  border: '1px solid rgba(255, 255, 255, 0.5)'
})

const CardTitle = styled('h5', {
  ...textVariant('primary2').true,
  marginBottom: '$1',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
})

const CardCollection = styled('p', {
  ...textVariant('secondary3').true,
  marginBottom: '$1'
})

const PriceInfo = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$3'
})

const UserContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$1',
  color: '$gray500'
})

const UserImg = styled('img', {
  width: '20px',
  height: '20px',
  borderRadius: '50%'
})

const UserName = styled('p', {
  ...textVariant('primary3').true,
  lineHeight: '50%'
})

const Price = styled('span', {
  ...textVariant('primary1'),
  color: '$blue900',
  fontWeight: '600'
})

const ButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center'
})

export default function NFTCard() {
  return (
    <Card>
      <CardImg src={cardImg} />
      <CardControls>
        <CardTitle>Ultra mega super VR Glassessssssssssssssssssssss...</CardTitle>
        <CardCollection>VR Glasses collection</CardCollection>
        <PriceInfo>
          <UserContainer>
            <UserImg src={userimg} />
            <UserName>UnderKong</UserName>
          </UserContainer>
          <Price>0.666 ETH</Price>
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
  )
}
