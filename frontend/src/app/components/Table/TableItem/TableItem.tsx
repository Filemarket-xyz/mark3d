import React, { FC } from 'react'
import { styled } from '../../../../styles'
import cross from './img/cross.svg'
import check from './img/check.svg'

const ItemWrapper = styled('div', {
  backgroundColor: '#fff',
  borderRadius: '$3',
  height: '80px',
  color: '$gray500',
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

interface Props {
  title?: string
  children: JSX.Element
}

export const TableItem: FC<Props> = ({ children }) => {
  return (
    <ItemWrapper>
      <ItemBody>
        <ItemProperty title>Spatial</ItemProperty>
        <ItemProperty>Separated world</ItemProperty>
        <ItemProperty>Etherium</ItemProperty>
        <ItemProperty>.glb, .gltf, .fbx, .obj, .dae, .pcd, </ItemProperty>
        <ItemProperty>100 MB 60 MB (.dae) 500 MB (.zip)</ItemProperty>
        <ItemProperty>
          <img src={check} alt='' />
        </ItemProperty>
        <ItemProperty>
          <img src={cross} alt='' />
        </ItemProperty>
        <ItemProperty>4/10</ItemProperty>
      </ItemBody>
      <ItemArrow>s</ItemArrow>
    </ItemWrapper>
  )
}
