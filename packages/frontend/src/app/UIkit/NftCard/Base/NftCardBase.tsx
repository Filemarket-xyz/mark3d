
import { Tooltip } from '@nextui-org/react'
import React, { MouseEventHandler, PropsWithChildren, ReactNode } from 'react'

import { Flex } from '../../Flex'
import { gradientPlaceholderImg } from '../../Placeholder'
import { Txt } from '../../Txt'
import {
  StyledButton,
  StyledButtonWrapper,
  StyledCard,
  StyledCardBorder,
  StyledCardInner,
  StyledCollectionName,
  StyledFileTypeContainer,
  StyledImg,
  StyledImgContainer,
  StyledImgRoot,
  StyledImgWrapper,
  StyledInfoWrapper,
  StyledTitle,
} from './NftCardBase.styles'

interface NftCardProps extends PropsWithChildren {
  className?: string
  to: string
  fileType?: ReactNode
  imgSrc: string
  title?: ReactNode
  collectionName?: ReactNode
  button: {
    onClick?: MouseEventHandler<HTMLAnchorElement>
    text: string
    to: string
  }
}

export const NftCardBase: React.FC<NftCardProps> = ({
  to,
  className,
  fileType,
  imgSrc,
  title,
  collectionName,
  children,
  button,
}) => {
  return (
    <StyledCard to={to} className={className}>
      <StyledCardBorder>
        <StyledCardInner>
          <StyledImgRoot>
            <StyledImgWrapper>
              <StyledImgContainer>
                <StyledFileTypeContainer>
                  <Tooltip
                    rounded
                    placement='top'
                    trigger='hover'
                    content='Internal hidden file type'
                    color="primary"
                  >
                    {fileType}
                  </Tooltip>
                </StyledFileTypeContainer>
                <StyledImg
                  src={imgSrc}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null
                    currentTarget.src = gradientPlaceholderImg
                  }}
                />
              </StyledImgContainer>
            </StyledImgWrapper>
          </StyledImgRoot>
          <StyledInfoWrapper>
            <Flex flexDirection='column' gap="$2" alignItems='start'>
              <Flex flexDirection='column' gap="$1" alignItems='start'>
                {title && <StyledTitle primary2>{title}</StyledTitle>}
                {collectionName && <StyledCollectionName primary3>{collectionName}</StyledCollectionName>}
              </Flex>
              {children}
            </Flex>
            <StyledButtonWrapper>
              <StyledButton
                primary
                small
                fullWidth
                borderRadiusSecond
                to={button.to}
                onClick={button.onClick}
              >
                <Txt primary3>{button.text}</Txt>
              </StyledButton>
            </StyledButtonWrapper>
          </StyledInfoWrapper>
        </StyledCardInner>
      </StyledCardBorder>
    </StyledCard>
  )
}
