import React from 'react'

import { Button, Txt } from '../../../UIkit'
import { BasicCardSquareImg } from '../BasicCard'
import {
  BorderLayout,
  ButtonContainer,
  Card,
  CardControls,
  CardTitle,
  Price,
  PriceInfo,
  UserContainer,
  UserImg,
  UserName,
} from './NamespaceCard.styles'

const formatPrice = (price: number) => {
  return `${price.toFixed(3)} ETH`
}

export interface NamespaceCardProps {
  imageURL: string
  title: string
  user: {
    img: string
    username: string
  }
  price: number
}

export const NamespaceCard: React.FC<NamespaceCardProps> = ({
  imageURL,
  title,
  user,
  price,
}) => {
  return (
    <BorderLayout>
      <Card>
        <BasicCardSquareImg src={imageURL} />
        <CardControls
          css={{
            height: 128,
          }}
        >
          <CardTitle css={{ marginBottom: '$2' }} title={title}>
            {title}
          </CardTitle>
          <PriceInfo>
            <UserContainer>
              <UserImg src={user.img} />
              <UserName>{user.username}</UserName>
            </UserContainer>
            <Price>{formatPrice(price)}</Price>
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
