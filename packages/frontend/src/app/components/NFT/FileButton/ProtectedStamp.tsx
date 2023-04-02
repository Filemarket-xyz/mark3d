import React, { FC, PropsWithChildren } from 'react'
import { styled } from '../../../../styles'
import protectedImg from './img/Protected.svg'

const LayoutStyled = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  justifyContent: 'center',
  gap: '$3',
  '@md': {
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto auto',
    gap: '$4',
    justifyContent: 'center'
  }
})

const ImgStyled = styled('img', {
  height: 64,
  display: 'block'
})

export const ProtectedStamp: FC<PropsWithChildren> = ({ children }) => {
  return (
    <LayoutStyled>
      {children}
      <ImgStyled
        src={protectedImg}
        alt="Protected by EFT"
      />
    </LayoutStyled>
  )
}
