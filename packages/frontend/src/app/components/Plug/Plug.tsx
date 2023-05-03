import React, { FC, ReactNode, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { styled } from '../../../styles'
import { Button, textVariant, Txt } from '../../UIkit'

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

export type TypePlug = 'NFT' | 'Activity' | 'Nothing'

interface PlugProps {
  type: TypePlug
}

const PludHeader: Record<TypePlug, string> = {
  NFT: 'You don`t have any NFTs ',
  Activity: 'You don`t have any activity',
  Nothing: 'Nothing found'
}

const PludText: Record<TypePlug, string> = {
  NFT: 'Create your own NFT or go to the market to find something amazing',
  Activity: 'Get started by creating your own NFT or go to the market to find something amazing',
  Nothing: 'Try changing the search settings'
}

const Plug: FC<PlugProps> = ({ type }) => {
  const navigate = useNavigate()

  const PludButtons: Record<TypePlug, ReactNode> = {
    NFT: <><Button primary onClick={() => { navigate('/market') }}><Txt primary1>3D Market</Txt></Button><Button onClick={() => { navigate('/create') }}><Txt primary1>Create</Txt></Button></>,
    Activity: <><Button primary onClick={() => { navigate('/market') }}><Txt primary1>3D Market</Txt></Button><Button onClick={() => { navigate('/create') }}><Txt primary1>Create</Txt></Button></>,
    Nothing: <></>
  }

  const header: string = useMemo(() => {
    return PludHeader[type]
  }, [type])

  const text: string = useMemo(() => {
    return PludText[type]
  }, [type])

  const buttons: ReactNode = useMemo(() => {
    return PludButtons[type]
  }, [type])

  return (
    <PlugStyle>
        <Header>{header}</Header>
        <MainText>{text}</MainText>
      <ButtonsContainer>{buttons}</ButtonsContainer>
    </PlugStyle>
  )
}

export default Plug
