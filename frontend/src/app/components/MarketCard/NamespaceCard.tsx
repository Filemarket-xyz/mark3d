import React, { useCallback } from 'react'
import { styled } from '../../../styles'
import { Button, Txt } from '../../UIkit'
import { BasicCardSquareImg } from './BasicCard'
import {
  ButtonContainer,
  Card,
  CardControls,
  CardTitle,
  Price,
  PriceInfo,
  UserContainer,
  UserImg,
  UserName
} from './NFTCard'

export interface Props {
  imageURL: string
  title: string
  user: {
    img: string
    username: string
  }
  price: number
}

const NamespaceCardControls = styled(CardControls, {
  height: 128
})

export default function NamespaceCard(props: Props) {
  const formatPrice = useCallback((price: number) => {
    return `${price.toFixed(3)} ETH`
  }, [])

  return (
    <Card>
      <BasicCardSquareImg src={props.imageURL} />
      <NamespaceCardControls>
        <CardTitle css={{ marginBottom: '$2' }} title={props.title}>
          {props.title}
        </CardTitle>
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
      </NamespaceCardControls>
    </Card>
  )
}
