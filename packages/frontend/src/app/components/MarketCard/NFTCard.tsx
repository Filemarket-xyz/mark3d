import React from 'react'
import { useNavigate } from 'react-router-dom'

import { styled } from '../../../styles'
import { HiddenFileMetaData } from '../../../swagger/Api'
import { useCollectionTokenListStore } from '../../hooks/useCollectionTokenListStore'
import { gradientPlaceholderImg, NavButton, textVariant, Txt } from '../../UIkit'
import { formatCurrency, formatUsd } from '../../utils/web3'
import BasicCard, { BasicCardControls, BasicCardSquareImg } from './BasicCard'
import FileType from './FileType'

export const CardControls = styled(BasicCardControls, {
  height: '172px',
  position: 'absolute',
  left: 0,
  right: 0,
  transform: 'translateY(0)',
  transition: 'all 0.25s ease-in-out',
  bottom: '-65px',
  paddingTop: '12px',
  border: '1px solid #E9E9EA',
  borderRadius: '16px'
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
    transform: 'translateY(-73px)',
    transitionDelay: '0s'
  }

  hoverStyles[`&:hover ${CardTitle.selector}`] = {
    color: '$blue900',
    transitionDelay: '0s'
  }
  hoverStyles['&:hover'] = {
    border: '2px solid transparent',
    background:
            'linear-gradient($white 0 0) padding-box, $gradients$main border-box',
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
  marginBottom: '$3',
  background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), $gray800',
  borderRadius: '8px',
  height: '32px',
  width: '100%',
  padding: '0 8px',
  marginTop: '8px',
  variants: {
    noneOpacity: {
      true: {
        opacity: 0
      }
    }
  }
})

export const UserContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$1',
  color: '$gray500',
  height: 20
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
  ...textVariant('primary2'),
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  color: '$blue900',
  fontWeight: '600',
  lineHeight: '$body2'
})

export const PriceUsd = styled('span', {
  color: '$gray600'
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
  button: {
    text: string
    link: string
  }
  priceUsd?: string
  price?: string
  hiddenFile?: HiddenFileMetaData
}

export const Card = styled(BasicCard, {
  cursor: 'pointer'
})

export const BorderLayout = styled('div', {
  background: 'rgba(255,255,255,0.9)',
  width: '259px',
  height: '383px',
  borderRadius: 'calc($3 + 2px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  paddingTop: '12px',
  border: '1px solid #E9E9EA',
  position: 'relative',
  ...generateHoverStylesForCard()
})

export const NFTCard: React.FC<NFTCardProps> = ({
  collection,
  button,
  imageURL,
  hiddenFile,
  title,
  user,
  price,
  priceUsd
}) => {
  const navigate = useNavigate()
  const { data: collectionAndNfts } = useCollectionTokenListStore(collection)

  return (
    <BorderLayout>
      <Card onClick={() => navigate(button.link)}>
        <BasicCardSquareImg
          src={imageURL}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = gradientPlaceholderImg
          }}
        />
        <FileType file={hiddenFile} />
        <CardControls>
          <CardTitle title={title}>{title}</CardTitle>
          <CardCollection>{collectionAndNfts.collection?.name}</CardCollection>
          <UserContainer>
            <UserImg src={user.img} />
            <UserName>{user.username}</UserName>
          </UserContainer>
          <PriceInfo noneOpacity={price === undefined}>
            <Price>
              {formatCurrency(price ?? 0)}
              <PriceUsd>
                ~
                {formatUsd(priceUsd ?? 0)}
              </PriceUsd>
            </Price>
          </PriceInfo>
          <ButtonContainer>
            <NavButton
              primary
              small
              to={button.link}
              css={{
                textDecoration: 'none',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '100%'
              }}
            >
              <Txt primary3>{button.text}</Txt>
            </NavButton>
          </ButtonContainer>
        </CardControls>
      </Card>
    </BorderLayout>
  )
}
