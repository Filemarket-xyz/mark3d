/* eslint-disable react/jsx-one-expression-per-line */
import React, { Fragment, useMemo } from 'react'

import BunnyGreen from '../../../../assets/img/WhitelistCard/BunnyGreen.png'
import BunnyPurple from '../../../../assets/img/WhitelistCard/BunnyPurple.png'
import { ButtonProps } from '../../Button'
import { Flex } from '../../Flex'
import { Txt } from '../../Txt'
import { CardImg } from '../CardImg'
import { WhitelistCardButton, WhitelistCardButtonProps } from './Button'
import { StyledCard, StyledCardBackground, StyledCardInfo, StyledCardInner, StyledDescription, StyledRarity, StyledRarityButton, StyledText, StyledValueList } from './WhitelistCard.styles'

const rarityList = ['common', 'uncommon', 'rare', 'legendary', 'mythical'] as const
const valueList = [
  'Printable 3d model of FIL coin',
  'Filecoin Wallpapers',
  'Filecoin Soundtrack',
  'Filecoin Ecosystem Catalog',
  'Gifts and Bonuses from partners',
  'Chance to find the Lucky Jammy card',
]

interface WhitelistCardProps {
  price?: number
  variant: 'whitelist' | 'mint'
  buttonProps: Omit<WhitelistCardButtonProps, 'variant'> & {
    variant: 'free' | 'check'
  }
  rarityButtonProps: ButtonProps
}

export const WhitelistCard: React.FC<WhitelistCardProps> = ({
  variant = 'whitelist',
  price = 12,
  buttonProps,
  rarityButtonProps,
}) => {
  const { img, text, rarities, total, _buttonProps } = useMemo(() => {
    if (variant === 'whitelist') {
      return {
        img: BunnyPurple,
        text: 'Only for WL owners',
        rarities: rarityList.slice(0, 2),
        total: 7000,
        _buttonProps: buttonProps,
      }
    }

    return {
      img: BunnyGreen,
      text: `${price} FIL`,
      rarities: rarityList.slice(1),
      total: 3000,
      _buttonProps: {
        ...buttonProps,
        variant: 'mint' as const,
      },
    }
  }, [variant, price, buttonProps])

  return (
    <StyledCard>
      <StyledCardBackground />
      <StyledCardInner flexDirection='column' gap={20}>
        <Flex
          w100
          flexDirection='column'
          alignItems='start'
          gap={12}
          flexGrow={1}
          css={{ position: 'relative' }}
        >
          <CardImg src={img} variant='secondary' />
          <StyledCardInfo
            w100
            alignItems='start'
            flexDirection='column'
            justifyContent='space-between'
            flexGrow={1}
            gap={8}
          >
            <Flex
              flexDirection='column'
              alignItems='start'
              justifyContent='space-between'
              gap={4}
            >
              <Txt primary1>Rarity:</Txt>
              <div>
                {rarities.map((rarity, i) => (
                  <Fragment key={rarity}>
                    <StyledRarity rarity={rarity}>
                      {rarity}
                    </StyledRarity>
                    {i + 1 !== rarities.length && ', '}
                  </Fragment>
                ))}
              </div>
            </Flex>
            <Flex w100 justifyContent='space-between'>
              <Txt primary1>Total EFTs:</Txt>
              <Txt primary1>{total}</Txt>
            </Flex>
          </StyledCardInfo>
          <StyledDescription
            w100
            flexDirection='column'
            alignItems='start'
            justifyContent='space-between'
          >
            <div>
              The owner of this EFT unlocks access to download an archive packed with an assortment of
              <span> extra value:</span>
            </div>
            <StyledValueList
              w100
              flexDirection='column'
              alignItems='start'
              gap={8}
            >
              {valueList.map((value) => <span key={value}>{value}</span>)}
            </StyledValueList>
            <Flex w100 justifyContent='center'>
              <StyledRarityButton {...rarityButtonProps}>
                FileBunnies Rarities
              </StyledRarityButton>
            </Flex>
          </StyledDescription>
        </Flex>
        <StyledText>{text}</StyledText>
        <WhitelistCardButton fullWidth {..._buttonProps} />
      </StyledCardInner>
    </StyledCard>
  )
}
