
import { Tooltip } from '@nextui-org/react'
import React, { MouseEventHandler, PropsWithChildren, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { Flex } from '../../../Flex'
import { Txt } from '../../../Txt'
import { CardImg } from '../../CardImg'
import {
  StyledButton,
  StyledButtonWrapper,
  StyledCard,
  StyledCardBorder,
  StyledCardInner,
  StyledCollectionName,
  StyledFileTypeContainer,
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
  const navigate = useNavigate()

  return (
    <StyledCard onClick={() => { navigate(to) }} className={className}>
      <StyledCardBorder>
        <StyledCardInner>
          <CardImg src={imgSrc}>
            {fileType && (
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
            )}
          </CardImg>
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
