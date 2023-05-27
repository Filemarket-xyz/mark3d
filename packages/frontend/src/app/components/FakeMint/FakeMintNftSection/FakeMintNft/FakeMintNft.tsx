import { ComponentProps } from '@stitches/react'
import { utils } from 'ethers'
import React, { FC } from 'react'

import { styled } from '../../../../../styles'
import { mark3dConfig } from '../../../../config/mark3d'
import { Button, gradientPlaceholderImg, Txt } from '../../../../UIkit'
import { BasicCardSquareImg } from '../../../MarketCard/BasicCard'
import {
  Price,
} from '../../../MarketCard/NFTCard'

const HeightContainer = styled('div', {
  height: '566px',
  display: 'flex',
  alignItems: 'center',
})

const BorderLayoutFakeNft = styled('div', {
  width: '300px',
  height: '510px',
  background: 'rgba(255,255,255,0.85)',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  paddingTop: '24px',
  border: '1px solid #E9E9EA',
  boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.15)',
  borderRadius: '40px',
  '& button': {
    transition: 'all 0s ease-in-out 0s',
    transitionDelay: '0',
    opacity: '0',
  },
  '&:hover': {
    background: 'white',
    boxShadow: '0px 10px 45px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.25s ease-in-out 0s',
    '& button': {
      transitionDelay: '0.25s',
      opacity: '1',
    },
    height: '566px',
  },
  variants: {
    rarity: {
      common: {
        '&:hover': {
          border: '5px solid #77AFFF',
        },
      },
      uncommon: {
        '&:hover': {
          border: '5px solid #4481EB',
        },
      },
      rare: {
        '&:hover': {
          border: '5px solid #37ECBA',
        },
      },
      legendary: {
        '&:hover': {
          border: '5px solid #7579FF',
        },
      },
      mythical: {
        '&:hover': {
          border: '5px solid #FF9A44',
        },
      },
    },
  },
})

const CardRarity = styled('span', {
  fontSize: '18px',
  fontWeight: '600',
  display: 'flex',
  gap: '8px',
  paddingTop: '12px',
  '& span': {
    letterSpacing: '0.1em',
    fontWeight: '700',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
  },
  variants: {
    rarity: {
      common: {
        '& span': {
          background: 'linear-gradient(90deg, #ACCBEE 0%, #77AFFF 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          backgroundClip: 'text',
          textFillColor: 'transparent',
        },
      },
      uncommon: {
        '& span': {
          background: 'linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          backgroundClip: 'text',
          textFillColor: 'transparent',
        },
      },
      rare: {
        '& span': {
          background: 'linear-gradient(90deg, #37ECBA 0%, #72AFD3 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          backgroundClip: 'text',
          textFillColor: 'transparent',
        },
      },
      legendary: {
        '& span': {
          background: 'linear-gradient(90deg, #B224EF 0%, #7579FF 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          backgroundClip: 'text',
          textFillColor: 'transparent',
        },
      },
      mythical: {
        '& span': {
          background: 'linear-gradient(90deg, #FC6076 0%, #FF9A44 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          backgroundClip: 'text',
          textFillColor: 'transparent',
        },
      },
    },
  },
})

const FakeNftCard = styled('div', {
  color: '#656669',
  maxWidth: '252px',
  margin: '0 auto',
  height: '100%',
})

const Line = styled('div', {
  height: '1px',
  width: '179px',
  margin: '9px 0',
  variants: {
    rarity: {
      common: {
        background: 'linear-gradient(90deg, #ACCBEE 0%, #77AFFF 100%)',
      },
      uncommon: {
        background: 'linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)',
      },
      rare: {
        background: 'linear-gradient(90deg, #37ECBA 0%, #72AFD3 100%)',
      },
      legendary: {
        background: 'linear-gradient(90deg, #B224EF 0%, #7579FF 100%)',
      },
      mythical: {
        background: 'linear-gradient(90deg, #FC6076 0%, #FF9A44 100%)',
      },
    },
  },
})

const CardFakeNftText = styled('span', {
  fontSize: '18px',
  fontWeight: '600',
  display: 'flex',
  columnGap: '8px',
  flexWrap: 'wrap',
  '& span': {
    fontSize: '18px',
    fontWeight: '700',
    color: '#232528',
    letterSpacing: '0.15em',
  },
})

const CardInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
})

const PriceFakeNft = styled(Price, {
  fontSize: '24px',
  fontWeight: '700',
  paddingTop: '8px',
})

const ButtonContainer = styled('div', {
  display: 'flex',
  alignItems: 'flex-end',
  height: '75px',
  '& span': {
    fontWeight: '700',
    color: 'white',
  },
})

const BasicCardSquareImgFakeNft = styled(BasicCardSquareImg, {
  width: '252px',
  height: '252px',
})

type FakeMintNftProps = ComponentProps<typeof CardRarity> & {
  price: string
  chance: string
  imageURL: string
}

const FakeMintNft: FC<FakeMintNftProps> = ({ rarity, imageURL, chance, price }) => {
  return (
    <HeightContainer>
      <BorderLayoutFakeNft rarity={rarity}>
        <FakeNftCard>
          <BasicCardSquareImgFakeNft
            src={imageURL}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = gradientPlaceholderImg
            }}
          />
          <CardInfo>
            <CardRarity rarity={rarity}>
              Rarity:
              <Txt h5>
                {rarity?.toString().toUpperCase()}
              </Txt>
            </CardRarity>
            <Line rarity={rarity} />
            <CardFakeNftText>
              Jammy Chance:
              {' '}
              <Txt h5>
                {chance}
                %
              </Txt>
            </CardFakeNftText>
            <CardFakeNftText>
              Encrypted file inside:
              {' '}
              <Txt h5>Gifts Bundle</Txt>
            </CardFakeNftText>
            <PriceFakeNft>
              {utils.formatUnits(price ?? '0', mark3dConfig.chain.nativeCurrency.decimals).split('.')[0]}
              {' '}
              {mark3dConfig.chain.nativeCurrency.symbol}
            </PriceFakeNft>
            <ButtonContainer>
              <Button
                fakeNft
                small
                fakeNftRarity={rarity}
                css={{
                  textDecoration: 'none',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  width: '100%',
                }}
              >
                <Txt body1>MINT</Txt>
              </Button>
            </ButtonContainer>
          </CardInfo>
        </FakeNftCard>
      </BorderLayoutFakeNft>
    </HeightContainer>
  )
}

export default FakeMintNft
