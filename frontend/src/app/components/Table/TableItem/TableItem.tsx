import React, { FC } from 'react'
import { styled } from '../../../../styles'
import cross from './img/cross.svg'
import check from './img/check.svg'
import arrow from './img/arrow.svg'

const ItemWrapper = styled('div', {
  backgroundColor: '#fff',
  borderRadius: '$3',
  height: '80px',
  color: '$gray500',
  fontSize: '14px',
  display: 'flex',
  justifyContent: 'space-between'
})

const ItemBody = styled('div', {
  display: 'flex',
  padding: '$3 $4',
  alignItems: 'center'
})

const ItemArrow = styled('div', {
  alignItems: 'center',
  padding: '$4'
})

const ItemProperty = styled('div', {
  variants: {
    title: {
      true: {
        color: '$blue500',
        fontWeight: 600
      }
    }
  }
})

const Icon = styled('img', {
  width: '20px',
  height: '20px'
})

interface Props {
  title?: string
  children: JSX.Element
}

export const TableItem: FC<Props> = ({ children }) => {
  return (
    <ItemWrapper>
      <ItemBody>
        <ItemProperty title css={{ width: '112px' }}>
          Spatial
        </ItemProperty>
        <ItemProperty css={{ width: '174px' }}>Separated world</ItemProperty>
        <ItemProperty css={{ width: '174px' }}>Etherium</ItemProperty>
        <ItemProperty css={{ width: '174px' }}>
          .glb, .gltf, .fbx, .obj, .dae, .pcd,{' '}
        </ItemProperty>
        <ItemProperty css={{ width: '109px', marginLeft: '$3' }}>
          100 MB
          <br /> 60 MB (.dae)
          <br /> 500 MB (.zip)
        </ItemProperty>
        <ItemProperty css={{ width: '50px', marginLeft: '$3' }}>
          <Icon src={check} alt='Check icon' />
        </ItemProperty>
        <ItemProperty css={{ width: '109px', marginLeft: '$3' }}>
          <Icon src={cross} alt='Cross icon' />
        </ItemProperty>
        <ItemProperty>4/10</ItemProperty>
      </ItemBody>
      <ItemArrow>
        <img src={arrow} alt='' />
      </ItemArrow>
    </ItemWrapper>
  )
}
