import { Tooltip } from '@nextui-org/react'
import React from 'react'

import { styled } from '../../../styles'
import { Button, Container, Txt } from '../../UIkit'
import FakeMintNftSection from './FakeMintNftSection/FakeMintNftSection'

const FakeMintStyle = styled(Container, {
  background: 'linear-gradient(9.52deg, #55A8E7 7.18%, #4AC6D1 92.82%)',
  backgroundBlendMode: 'overlay, normal',
  mixBlendMode: 'normal',
  width: '100vw',
  minHeight: '992px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  color: 'white',
  paddingTop: '160px',
  paddingBottom: '80px',
  marginBottom: '48px',
  '& a': {
    color: 'white'
  },
  '& .topText': {
    marginBottom: '24px'
  },
  '& .buttons': {
    width: '100%',
    margin: '48px 120px 0',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',

    '& button': {
      color: '$blue500',
      width: '100%',
      height: '60px',
      background: 'white',
      boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)',
      borderRadius: '24px',
      textDecoration: 'dashed',
      textDecorationLine: 'underline',
      textUnderlineOffset: '5px'
    }
  },
  '@lg': {
    '& .tooltip': {
      width: '48%'
    }
  },

  '& .tooltip': {
    width: '49%'
  },
  '@sm': {
    paddingTop: '100px',
    '& .topText span': {
      fontSize: '24px'
    },
    '& .tooltip': {
      width: '100%'
    }
  }
})

const FakeMint = () => {
  return (
        <FakeMintStyle>
            <div className="topText">
                <Txt h1><a href={'/'}>FileBunnies</a> Minting</Txt>
            </div>
            <FakeMintNftSection />
            <div className="buttons">
                <Tooltip content={'Все подписываемся на канал демона и андроида!!!'} rounded color="primary" className={'tooltip'}>
                    <Button>How NFT with EFT works?</Button>
                </Tooltip>
                <Tooltip content={'Потому что нам не похуй на андроида!!!'} rounded color="primary" className={'tooltip'}>
                    <Button>How to MINT FileBunnies?</Button>
                </Tooltip>
            </div>
        </FakeMintStyle>
  )
}

export default FakeMint
