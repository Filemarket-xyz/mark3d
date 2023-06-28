import React from 'react'

import Circles from '../../../assets/img/GetAccessPage/Circles.svg'
import GreenStar from '../../../assets/img/GetAccessPage/GreenStar.svg'
import { styled } from '../../../styles'
import { textVariant } from '../../UIkit'

const GetAccessPageStyle = styled('div', {
  height: '100vh',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#F9F9F9',
  '& img': {
    position: 'absolute',
  },
  '& .fourthImg': {
    top: '-47px',
    left: '-66px',
  },
  '& .firstImg': {
    bottom: '-30px',
    right: '-81px',
  },
  '& .secondImg': {
    bottom: '-160px',
    left: '-141px',
  },
  '& .thirdImg': {
    top: '-107px',
    right: '-116px',
  },
  '@md': {
    '& .thirdImg, .secondImg': {
      transform: 'scale(0.5)',
    },
    '& .fourthImg': {
      top: '-36px',
    },
  },
  '@sm': {
    '& .firstImg': {
      bottom: '-22px',
      right: '-58px',
      transform: 'scale(0.6)',
    },
    '& .thirdImg, .secondImg': {
      transform: 'scale(0.37)',
    },
    '& .fourthImg': {
      top: '-22px',
      transform: 'scale(0.7)',
    },
  },
})

export const MainBlock = styled('div', {
  padding: '130px 20px',
  border: '2px solid #0090FF',
  display: 'flex',
  justifyContent: 'center',
  borderRadius: '12px',
  position: 'relative',
  background: '#F9F9F9',
  '@lg': {
    padding: '80px 20px',
  },
  '@md': {
    padding: '80px 0',
  },
})

const Container = styled('div', {
  width: '777px',
  position: 'relative',
  '@lg': {
    width: '600px',
  },
  '@md': {
    width: '450px',
  },
  '@sm': {
    width: '300px',
  },
})

const Text = styled('h1', {
  ...textVariant('h4').true,
  textAlign: 'center',
  '@lg': {
    fontSize: '32px',
  },
  '@md': {
    fontSize: '24px',
  },
  '@sm': {
    fontSize: '16px',
  },
})

const NotWorking = () => {
  return (
    <GetAccessPageStyle>
      <Container>
        <img className={'thirdImg'} src={GreenStar} />
        <MainBlock>
          <Text>
            We do apologize for the delay of FileBunnies Minting.
            <br />
            Due to technical issues with FileBunnies Smart Contract setup the minting is postponed to
            {' '}
            <span style={{ color: '#0090FF' }}>5 PM UTC</span>
            .
            <br />
            Minting will be available at this page
          </Text>
          <img className={'secondImg'} src={Circles} />
        </MainBlock>
      </Container>
    </GetAccessPageStyle>
  )
}

export default NotWorking
