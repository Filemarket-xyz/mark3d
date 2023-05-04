import React, { FC, ReactNode } from 'react'

import { styled } from '../../../styles'
import { textVariant } from '../../UIkit'

const PlugStyle = styled('div', {
  border: '2px solid #088DFA',
  borderRadius: '32px',
  width: '603px',
  padding: '32px',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '32px',
  margin: 'auto',
  '@md': {
    width: '100%'
  },
  marginBottom: '32px'
})

const Header = styled('h3', {
  ...textVariant('h3').true,
  fontWeight: '600',
  textAlign: 'center'
})

const MainText = styled('h4', {
  ...textVariant('primary1').true,
  fontSize: '18px',
  textAlign: 'center',
  fontWeight: '400'
})

const ButtonsContainer = styled('div', {
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  gap: '30px',
  '& button': {
    width: '100%'
  },
  '@sm': {
    flexDirection: 'column',
    gap: '15px'
  }
})

interface PlugProps {
  header: ReactNode
  mainText: ReactNode
  buttonsBlock: ReactNode
}

const Plug: FC<PlugProps> = ({ header, mainText, buttonsBlock }) => {
  return (
    <PlugStyle>
        <Header>{header}</Header>
        <MainText>{mainText}</MainText>
      <ButtonsContainer>{buttonsBlock}</ButtonsContainer>
    </PlugStyle>
  )
}

export default Plug
