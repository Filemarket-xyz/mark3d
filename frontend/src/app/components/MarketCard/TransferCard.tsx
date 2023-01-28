import React from 'react'
import { NavButton, Txt, gradientPlaceholderImg } from '../../UIkit'
import { BasicCardSquareImg } from './BasicCard'
import {
  BorderLayout,
  ButtonContainer,
  Card,
  CardCollection,
  CardControls,
  CardTitle,
  Price,
  PriceInfo,
  UserContainer,
  UserImg,
  UserName
} from './NFTCard'

export interface TransferCardProps {
  imageURL: string
  title: string
  collection: string
  user: {
    img: string
    username: string
  }
  button: {
    link: string
    text: string
  }
  price?: string
  status: string
}

export const TransferCard = (props: TransferCardProps) => {
  return (
    <BorderLayout>
      <Card>
        <BasicCardSquareImg
          src={props.imageURL}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = gradientPlaceholderImg
          }}
        />
        <CardControls css={{ height: 172 }}>
          <CardTitle title={props.title}>{props.title}</CardTitle>
          <CardCollection>{props.collection}</CardCollection>
          <PriceInfo css={{ marginBottom: '$2' }}>
            <UserContainer>
              <UserImg src={props.user.img} />
              <UserName>{props.user.username}</UserName>
            </UserContainer>
            {props.price !== undefined && (
              <Price>{props.price}</Price>
            )}
          </PriceInfo>
          <PriceInfo css={{ marginBottom: '$3' }}>
            <Txt css={{ fontWeight: 600, color: '$gray500' }} primary3>
              Status
            </Txt>
            <Txt css={{ fontWeight: 600, color: '$blue900' }} primary1>
              {props.status}
            </Txt>
          </PriceInfo>
          <ButtonContainer>
            <NavButton
              primary
              to={props.button.link}
              small={true}
              css={{
                textDecoration: 'none',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              <Txt primary3>{props.button.text}</Txt>
            </NavButton>
          </ButtonContainer>
        </CardControls>
      </Card>
    </BorderLayout>
  )
}
