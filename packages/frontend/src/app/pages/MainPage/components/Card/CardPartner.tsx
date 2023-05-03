import React, { FC, ComponentProps } from 'react'

import { styled } from '../../../../../styles'
import { Txt } from '../../../../UIkit'

const CardPartnerStyle = styled('a', {
  width: '170px',
  height: '160px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid $gray300',
  textDecoration: 'none',
  flexDirection: 'column',
  gap: '20px',
  background: '#FFFFFF',
  boxShadow: '0px 4px 20px rgba(35, 37, 40, 0.05)',
  borderRadius: '24px',
  variants: {
    partners: {
      true: {
        width: '210px',
        height: '200px'
      }
    }
  }
})

export type CardPartnerProps = ComponentProps<typeof CardPartnerStyle> & {
  img: string
  text?: string
  url?: string
}

const CardPartner: FC<CardPartnerProps> = ({ img, text, url, partners }) => {
  return (
    <CardPartnerStyle href={url} target={'_blank'} partners={partners}>
      <img src={img}/>
      <Txt primary1>{text}</Txt>
    </CardPartnerStyle>
  )
}

export default CardPartner
